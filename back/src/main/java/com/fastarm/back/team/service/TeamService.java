package com.fastarm.back.team.service;

import com.fastarm.back.common.constants.S3Constants;
import com.fastarm.back.common.service.S3Service;
import com.fastarm.back.notification.entity.NotificationTeamInvite;
import com.fastarm.back.notification.enums.Status;
import com.fastarm.back.notification.enums.Type;
import com.fastarm.back.notification.repository.NotificationRepository;
import com.fastarm.back.notification.repository.NotificationTeamInviteRepository;
import com.fastarm.back.team.controller.dto.TeamDetailRequest;
import com.fastarm.back.team.controller.dto.TeamInviteResponse;
import com.fastarm.back.team.dto.*;
import com.fastarm.back.team.entity.Team;
import com.fastarm.back.team.entity.TeamMember;
import com.fastarm.back.team.exception.TeamImageUploadException;
import com.fastarm.back.team.exception.TeamMemberNotFoundException;
import com.fastarm.back.team.repository.TeamRepository;
import com.fastarm.back.team.repository.TeamMemberRepository;
import com.fastarm.back.member.entity.Member;
import com.fastarm.back.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fastarm.back.member.exception.MemberNotFoundException;
import com.fastarm.back.team.exception.TeamNotFoundException;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamMemberRepository teamMemberRepository;
    private final TeamRepository teamRepository;
    private final MemberRepository memberRepository;
    private final NotificationTeamInviteRepository notificationTeamInviteRepository;
    private final NotificationRepository notificationRepository;
    private final S3Service s3Service;


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
    public TeamInviteResponse inviteTeam(TeamInviteDto dto){
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
