package com.fastarm.back.notification.service;

import com.fastarm.back.member.entity.Member;
import com.fastarm.back.member.exception.MemberNotFoundException;
import com.fastarm.back.member.repository.MemberRepository;
import com.fastarm.back.notification.controller.dto.NotificationDetailRequest;
import com.fastarm.back.notification.controller.dto.NotificationResponse;
import com.fastarm.back.notification.dto.NotificationDetailDto;
import com.fastarm.back.notification.dto.NotificationDto;
import com.fastarm.back.notification.dto.TeamInviteNotificationDto;
import com.fastarm.back.notification.entity.Notification;
import com.fastarm.back.notification.entity.NotificationTeamInvite;
import com.fastarm.back.notification.enums.Type;
import com.fastarm.back.notification.exception.AlreadyInviteException;
import com.fastarm.back.notification.exception.NotificationNotFoundException;
import com.fastarm.back.notification.repository.NotificationRepository;
import com.fastarm.back.notification.repository.NotificationTeamInviteRepository;
import com.fastarm.back.team.dto.TeamDetailDto;
import com.fastarm.back.team.dto.TeamDetailMemberDto;
import com.fastarm.back.team.entity.Team;
import com.fastarm.back.team.entity.TeamMember;
import com.fastarm.back.team.exception.TeamNotFoundException;
import com.fastarm.back.team.repository.TeamMemberRepository;
import com.fastarm.back.notification.exception.TeamInviteNotificationNotFoundException;
import com.fastarm.back.team.repository.TeamRepository;
import com.fastarm.back.team.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static java.security.AccessController.checkPermission;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final TeamMemberRepository teamMemberRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationTeamInviteRepository notificationTeamInviteRepository;
    private final MemberRepository memberRepository;
    private final TeamRepository teamRepository;
    private final TeamService teamService;

    @Transactional(readOnly = true)
    public List<NotificationResponse> findNotificationList(String loginId){
        Member member = memberRepository.findByLoginId(loginId).orElseThrow(MemberNotFoundException::new);
        return notificationRepository.findAllByReceiver(member);
    }

    @Transactional(readOnly = true)
    public NotificationDetailDto findNotificationDetail(NotificationDetailRequest dto){
        Member member = memberRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);
        Notification notification = notificationRepository.findById(dto.getNotificationId())
                .orElseThrow(NotificationNotFoundException::new);
        isMemberNotification(notification,member);

        if(notification.getType()==Type.TEAM_INVITE){
            Team team = notificationTeamInviteRepository.findById(notification.getId())
                    .orElseThrow(TeamNotFoundException::new)
                    .getTeam();
            List<TeamDetailMemberDto> members = teamMemberRepository.findMembersByTeamId(team.getId());

            return NotificationDetailDto.builder()
                    .teamImage(team.getTeamImage())
                    .teamName(team.getName())
                    .teamMemberCnt(members.size())
                    .members(members)
                    .build();
        }
        else throw new NotificationNotFoundException();
    }
    @Transactional(readOnly = true)
    public Boolean checkUnreadNotification(String loginId){
        Member member = memberRepository.findByLoginId(loginId).orElseThrow(MemberNotFoundException::new);
        return notificationRepository.existsByReceiverAndIsReadFalse(member);
    }

    @Transactional
    public void respondTeamInvitation(TeamInviteNotificationDto dto){
        NotificationTeamInvite notificationInvite = notificationTeamInviteRepository.findById(dto.getNotificationId())
                .orElseThrow(TeamInviteNotificationNotFoundException::new);

        Member receiver = notificationInvite.getReceiver();

        if (dto.getAccept() != null && dto.getAccept()){
            notificationInvite.accept();

            Team team = notificationInvite.getTeam();

            boolean alreadyExists = teamMemberRepository.existsByTeamAndMember(team,receiver);
            if (alreadyExists) {
                throw new AlreadyInviteException();
            }

            TeamMember teamMember = TeamMember.builder()
                    .member(receiver)
                    .team(team)
                    .build();

            teamMemberRepository.save(teamMember);
        } else {
            notificationInvite.reject();
        }
        notificationTeamInviteRepository.save(notificationInvite);
    }

    @Transactional
    public void readNotification(NotificationDto dto){
        Notification notification = notificationRepository.findById(dto.getNotificationId())
                .orElseThrow(NotificationNotFoundException::new);

        Member member = memberRepository.findByLoginId(dto.getLoginId())
                        .orElseThrow(MemberNotFoundException::new);

        isMemberNotification(notification,member);

        notification.read();
        notificationRepository.save(notification);

    }

    @Transactional
    public void removeNotification(NotificationDto dto){
        Notification notification = notificationRepository.findById(dto.getNotificationId())
                .orElseThrow(NotificationNotFoundException::new);

        Member member = memberRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        isMemberNotification(notification,member);
        notification.delete();
        notificationRepository.save(notification);

    }

    @Transactional
    public void isMemberNotification(Notification notification, Member member) {
        if(!notification.getReceiver().getId().equals(member.getId()))
            throw new NotificationNotFoundException();
    }
}
