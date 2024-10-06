package com.fastarm.back.team.service;


import com.fastarm.back.common.constants.RedisConstants;
import com.fastarm.back.common.constants.RedisFieldConstants;
import com.fastarm.back.common.service.RedisService;
import com.fastarm.back.common.service.S3Service;
import com.fastarm.back.notification.entity.NotificationTeamInvite;
import com.fastarm.back.notification.enums.Status;
import com.fastarm.back.notification.enums.Type;
import com.fastarm.back.notification.repository.NotificationRepository;
import com.fastarm.back.notification.repository.NotificationTeamInviteRepository;
import com.fastarm.back.notification.service.NotificationService;
import com.fastarm.back.team.controller.dto.TeamDetailRequest;
import com.fastarm.back.team.controller.dto.TeamInviteResponse;
import com.fastarm.back.team.dto.*;
import com.fastarm.back.team.entity.Team;
import com.fastarm.back.team.entity.TeamMember;
import com.fastarm.back.team.exception.TeamMemberNotFoundException;
import com.fastarm.back.team.repository.TeamRepository;
import com.fastarm.back.team.repository.TeamMemberRepository;
import com.fastarm.back.member.entity.Member;
import com.fastarm.back.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fastarm.back.member.exception.MemberNotFoundException;
import com.fastarm.back.team.exception.TeamNotFoundException;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;


@Slf4j
@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamMemberRepository teamMemberRepository;
    private final TeamRepository teamRepository;
    private final MemberRepository memberRepository;
    private final NotificationTeamInviteRepository notificationTeamInviteRepository;
    private final NotificationRepository notificationRepository;
    private final S3Service s3Service;
    private final RedisService redisService;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<TeamDto> getMyTeams(String loginId){

        Member member = memberRepository.findByLoginId(loginId).orElseThrow(MemberNotFoundException::new);
        return teamMemberRepository.findTeamsWithMemberCountByMemberId(member.getId());

    }

    @Transactional(readOnly = true)
    public TeamDetailDto getTeamDetail(TeamDetailRequest dto) {

        Team team = teamRepository.findById(dto.getTeamId()).orElseThrow(TeamNotFoundException::new);
        Member member = memberRepository.findByLoginId(dto.getLoginId()).orElseThrow(MemberNotFoundException::new);
        checkPermission(member,team);
        List<TeamDetailMemberDto> members = teamMemberRepository.findMembersByTeamId(dto.getTeamId());

        return TeamDetailDto.of(
                team.getTeamImage(),
                team.getName(),
                members
        );
    }

    @Transactional
    public TeamInviteResponse inviteTeam(TeamInviteDto dto) throws ExecutionException, InterruptedException {
        Member sender = memberRepository.findByLoginId(dto.getLoginId()).orElseThrow(MemberNotFoundException::new);
        Team team = teamRepository.findById(dto.getTeamId()).orElseThrow(TeamNotFoundException::new);
        checkPermission(sender,team);


        List<String> successfulInvites = new ArrayList<>();
        List<String> alreadyInGroup = new ArrayList<>();
        List<String> previouslyInvited = new ArrayList<>();

        for (String receiverNickName : dto.getReceivers()) {

            Member member = memberRepository.findByNickname(receiverNickName).orElseThrow(MemberNotFoundException::new);


            if (teamMemberRepository.existsByTeamAndMember(team,member)) {
                alreadyInGroup.add(receiverNickName);
                continue;
            }

            if (notificationTeamInviteRepository.existsByTeamAndReceiverIdAndStatus(team,member.getId(), Status.WAIT)) {
                previouslyInvited.add(receiverNickName);
                continue;
            }

            successfulInvites.add(receiverNickName);


            NotificationTeamInvite teamInvite = NotificationTeamInvite.builder()
                    .receiver(member)
                    .sender(sender)
                    .content(team.getName() + " 팀 초대장이 왔어요!")
                    .type(Type.TEAM_INVITE)
                    .team(team)
                    .isDeleted(false)
                    .isRead(false)
                    .status(Status.WAIT)
                    .build();
            notificationTeamInviteRepository.save(teamInvite);


            String fcmToken = (String) redisService.getHashData(RedisConstants.TOKEN+member.getLoginId(), RedisFieldConstants.FCM);
            if(fcmToken != null){
                String message = team.getName() + "팀에 초대되었습니다.";
                log.info("Sending notification to user with FCM token: {}", fcmToken);  // FCM 토큰 로그
                try {
                    notificationService.sendNotification(fcmToken, "팀 초대", message);
                } catch (ExecutionException e) {
                    log.error("ExecutionException occurred while sending notification: {}", e.getMessage());
                    e.printStackTrace(); // 에러의 스택 추적 추가
                } catch (InterruptedException e) {
                    log.error("InterruptedException occurred while sending notification: {}", e.getMessage());
                    e.printStackTrace(); // 에러의 스택 추적 추가
                }
            }else{
                log.warn("사용자 {}의 FCM 토큰이 없습니다.", receiverNickName);
            }

        }

        return TeamInviteResponse.builder()
                .successfulInvites(successfulInvites)
                .alreadyInGroup(alreadyInGroup)
                .previouslyInvited(previouslyInvited)
                .build();

    }

    @Transactional
    public Long createTeam(TeamAddDto dto) throws IOException {

        String imagePath = null;
        if(!dto.getTeamImage().isEmpty()) imagePath = s3Service.uploadFile(dto.getTeamImage());


        Team team = dto.toEntity(imagePath);
        Team savedTeam = teamRepository.save(team);

        Member member = memberRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        TeamMember teamMember = TeamMember.builder()
                .member(member)
                .team(savedTeam)
                .build();
        teamMemberRepository.save(teamMember);

        return savedTeam.getId();
    }

    @Transactional
    public void modifyTeam(TeamModifyDto dto) throws IOException, URISyntaxException {
        Member member = memberRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);
        Team team = teamRepository.findById(dto.getTeamId())
                .orElseThrow(TeamNotFoundException :: new);

        checkPermission(member,team);

        String imagPath=null;
        if(dto.getTeamImage().isEmpty() || dto.getTeamImage()==null){
            if(team.getTeamImage()!=null) imagPath=team.getTeamImage();

        }
        else{
            if(team.getTeamImage()!=null) s3Service.deleteFile(team.getTeamImage());
            imagPath = s3Service.uploadFile(dto.getTeamImage());
        }

        if(imagPath==null) team.changeTeamName(dto.getTeamName());
        else{team.changeTeam(dto.getTeamName(), imagPath);}
        teamRepository.save(team);
    }

    @Transactional
    public void checkPermission(Member member, Team team) {
        boolean isMember = teamMemberRepository.existsByTeamAndMember(team,member);
        if (!isMember) throw new TeamMemberNotFoundException();
    }

    @Transactional
    public void withdrawTeam(TeamWithdrawDto dto) throws URISyntaxException {
        Member member = memberRepository.findByLoginId(dto.getLoginId()).orElseThrow(MemberNotFoundException::new);
        Team team = teamRepository.findById(dto.getTeamId()).orElseThrow(TeamNotFoundException :: new);
        TeamMember teamMember = teamMemberRepository.findByTeamIdAndMemberId(dto.getTeamId(),member.getId())
                .orElseThrow(TeamMemberNotFoundException::new);

        teamMemberRepository.delete(teamMember);

        int remainingMembers = teamMemberRepository.countByTeamId(dto.getTeamId());
        if (remainingMembers==0){
            s3Service.deleteFile(team.getTeamImage());
            teamRepository.delete(team);
        }
    }
}
