package com.fastarm.back.connection.service;

import com.fastarm.back.common.constants.RedisConstants;
import com.fastarm.back.common.constants.RedisExpiredTimeConstants;
import com.fastarm.back.common.service.RedisService;
import com.fastarm.back.connection.entity.ConnectionInfo;
import com.fastarm.back.connection.enums.Mode;
import com.fastarm.back.connection.exception.AlreadyExistConnectionException;
import com.fastarm.back.connection.exception.CannotReserveException;
import com.fastarm.back.connection.repository.ConnectionInfoRepository;
import com.fastarm.back.karaoke.entity.Machine;
import com.fastarm.back.connection.dto.*;
import com.fastarm.back.connection.exception.CannotConnectException;
import com.fastarm.back.karaoke.dto.ReservationSaveDto;
import com.fastarm.back.karaoke.repository.MachineRepository;
import com.fastarm.back.member.entity.Member;
import com.fastarm.back.member.exception.MemberNotFoundException;
import com.fastarm.back.member.repository.MemberRepository;
import com.fastarm.back.song.entity.Song;
import com.fastarm.back.song.exception.NotFoundSongException;
import com.fastarm.back.song.repository.SongRepository;
import com.fastarm.back.team.entity.Team;
import com.fastarm.back.team.entity.TeamMember;
import com.fastarm.back.team.exception.TeamNotFoundException;
import com.fastarm.back.team.repository.TeamMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ConnectionServiceImpl implements ConnectionService {

    private final RedisService redisService;
    private final SongRepository songRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final MachineRepository machineRepository;
    private final MemberRepository memberRepository;
    private final ConnectionInfoRepository connectionInfoRepository;

    @Transactional
    @Override
    public void setConnection(ConnectionDto connectionDto) {

        Machine machine = machineRepository.findBySerialNumber(connectionDto.getSerialNumber())
                .orElseThrow(CannotConnectException::new);

        if (machine.getCoin() <= 0) {
            throw new CannotConnectException();
        }

        Member member = memberRepository.findByLoginId(connectionDto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        List<ConnectionInfo> connectionInfoList = connectionInfoRepository.findListByMember(member);

        if (!connectionInfoList.isEmpty()) {
            throw new AlreadyExistConnectionException();
        }

        ConnectionInfo connectionInfo = ConnectionInfo.builder()
                .machine(machine)
                .member(member)
                .mode(Mode.INDIVIDUAL)
                .build();

        connectionInfoRepository.save(connectionInfo);
    }

    @Transactional
    @Override
    public void setTeamConnection(TeamConnectionDto teamConnectionDto) {

        Machine machine = machineRepository.findBySerialNumber(teamConnectionDto.getSerialNumber())
                .orElseThrow(CannotConnectException::new);

        if (machine.getCoin() <= 0) {
            throw new CannotConnectException();
        }

        List<TeamMember> teamMemberList = teamMemberRepository.findByTeamId(teamConnectionDto.getTeamId());

        if (teamMemberList.isEmpty()) {
            throw new TeamNotFoundException();
        }

        for (TeamMember teamMember : teamMemberList) {
            List<ConnectionInfo> connectionInfoList = connectionInfoRepository.findListByMember(teamMember.getMember());

            if (!connectionInfoList.isEmpty()) {
                throw new AlreadyExistConnectionException();
            }

            ConnectionInfo connectionInfo = ConnectionInfo.builder()
                    .machine(machine)
                    .member(teamMember.getMember())
                    .mode(Mode.TEAM)
                    .team(teamMember.getTeam())
                    .build();

            connectionInfoRepository.save(connectionInfo);
        }
    }

    @Transactional(readOnly = true)
    @Override
    public boolean getConnectionStatus(String loginId) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(MemberNotFoundException::new);

        return connectionInfoRepository.findByMember(member).isPresent();
    }

    @Transactional
    @Override
    public void removeConnection(String loginId) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(MemberNotFoundException::new);

        connectionInfoRepository.deleteAllByMember(member);
    }

    @Transactional(readOnly = true)
    @Override
    public void reserveSong(ReservationDto reservationDto) {

        Member member = memberRepository.findByLoginId(reservationDto.getLoginId())
                        .orElseThrow(MemberNotFoundException::new);

        ConnectionInfo connectionInfo = connectionInfoRepository.findByMemberFetchMachine(member)
                .orElseThrow(CannotReserveException::new);

        Song song = songRepository.findByNumber(reservationDto.getNumber())
                .orElseThrow(NotFoundSongException::new);

        ReservationSaveDto reservationSaveDto;
        if (connectionInfo.getMode() == Mode.TEAM) {
            reservationSaveDto = ReservationSaveDto.builder()
                    .number(song.getNumber())
                    .title(song.getTitle())
                    .singer(song.getSinger())
                    .teamId(connectionInfo.getTeam().getId())
                    .mode(Mode.TEAM)
                    .build();
        } else {
            reservationSaveDto = ReservationSaveDto.builder()
                    .number(song.getNumber())
                    .title(song.getTitle())
                    .singer(song.getSinger())
                    .nickname(member.getNickname())
                    .mode(Mode.INDIVIDUAL)
                    .build();
        }
        String serialNumber = connectionInfo.getMachine().getSerialNumber();

        redisService.addToList(RedisConstants.RESERVATION_INFO + serialNumber, reservationSaveDto, RedisExpiredTimeConstants.CONNECTION_EXPIRED);
    }

}
