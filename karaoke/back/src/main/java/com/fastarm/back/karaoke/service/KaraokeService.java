package com.fastarm.back.karaoke.service;

import com.fastarm.back.common.constants.RedisConstants;
import com.fastarm.back.common.service.RedisService;
import com.fastarm.back.connection.entity.ConnectionInfo;
import com.fastarm.back.connection.enums.Mode;
import com.fastarm.back.connection.repository.ConnectionInfoRepository;
import com.fastarm.back.history.entity.PersonalSingHistory;
import com.fastarm.back.history.entity.TeamSingHistory;
import com.fastarm.back.history.repository.PersonalSingHistoryRepository;
import com.fastarm.back.history.repository.TeamSingHistoryRepository;
import com.fastarm.back.karaoke.constants.KaraokeConstants;
import com.fastarm.back.karaoke.dto.ChargeDto;
import com.fastarm.back.karaoke.dto.StartSongDto;
import com.fastarm.back.karaoke.entity.Machine;
import com.fastarm.back.karaoke.exception.CannotStartSongException;
import com.fastarm.back.karaoke.exception.NotFoundMachineException;
import com.fastarm.back.karaoke.repository.MachineRepository;
import com.fastarm.back.member.entity.Member;
import com.fastarm.back.member.exception.MemberNotFoundException;
import com.fastarm.back.member.repository.MemberRepository;
import com.fastarm.back.song.entity.Song;
import com.fastarm.back.song.exception.NotFoundSongException;
import com.fastarm.back.song.repository.SongRepository;
import com.fastarm.back.team.entity.Team;
import com.fastarm.back.team.exception.TeamNotFoundException;
import com.fastarm.back.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KaraokeService {

    private final MachineRepository machineRepository;
    private final SongRepository songRepository;
    private final MemberRepository memberRepository;
    private final TeamRepository teamRepository;
    private final ConnectionInfoRepository connectionInfoRepository;
    private final PersonalSingHistoryRepository personalSingHistoryRepository;
    private final TeamSingHistoryRepository teamSingHistoryRepository;
    private final RedisService redisService;

    @Transactional
    public void charge(ChargeDto chargeDto) {

        Machine machine = machineRepository.findBySerialNumber(chargeDto.getSerialNumber())
                .orElseThrow(NotFoundMachineException::new);

        if (machine.getCoin() == 0) {
            cleanMachineConnections(machine);
        }

        machine.chargeCoin(chargeDto.getCoin());
    }

    public void findRecommendations(String serialNumber) {

    }

    @Transactional
    public void startSong(StartSongDto startSongDto) {
        Machine machine = machineRepository.findBySerialNumber(startSongDto.getSerialNumber())
                .orElseThrow(NotFoundMachineException::new);

        if (machine.getCoin() == 0) {
            throw new CannotStartSongException();
        }

        Song song = songRepository.findByNumber(startSongDto.getNumber())
                .orElseThrow(NotFoundSongException::new);

        if (startSongDto.getMode() == Mode.INDIVIDUAL) {
            Member member = memberRepository.findByNickname(startSongDto.getNickname())
                    .orElseThrow(MemberNotFoundException::new);
            PersonalSingHistory personalSingHistory = PersonalSingHistory.builder()
                    .member(member)
                    .song(song)
                    .build();
            personalSingHistoryRepository.save(personalSingHistory);
        } else {
            Team team = teamRepository.findById(startSongDto.getTeamId())
                    .orElseThrow(TeamNotFoundException::new);
            TeamSingHistory teamSingHistory = TeamSingHistory.builder()
                    .team(team)
                    .song(song)
                    .build();
            teamSingHistoryRepository.save(teamSingHistory);
        }

        if (machine.getCoin() == KaraokeConstants.LAST_COIN) {
            cleanMachineConnections(machine);
        }

        machine.useCoin();
    }

    public List<Object> findReservations(String serialNumber) {
        return redisService.getListData(RedisConstants.RESERVATION_INFO + serialNumber);
    }

    @Transactional
    protected void cleanMachineConnections(Machine machine) {
        List<ConnectionInfo> connectionInfoList = connectionInfoRepository.findByMachine(machine);
        if (!connectionInfoList.isEmpty()) {
            connectionInfoRepository.deleteAll(connectionInfoList);
        }

        String reservationListKey = RedisConstants.RESERVATION_INFO + machine.getSerialNumber();
        List<Object> reservationList = redisService.getListData(reservationListKey);
        if (!reservationList.isEmpty()) {
            redisService.deleteData(reservationListKey);
        }
    }


}
