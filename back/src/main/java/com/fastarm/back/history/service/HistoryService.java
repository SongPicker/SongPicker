package com.fastarm.back.history.service;

import com.fastarm.back.history.controller.dto.*;
import com.fastarm.back.history.dto.DateSongsDto;
import com.fastarm.back.history.dto.SingDateDto;
import com.fastarm.back.history.dto.TeamRecentSongsDto;
import com.fastarm.back.history.repository.PersonalSingHistoryRepository;
import com.fastarm.back.history.repository.TeamSingHistoryRepository;
import com.fastarm.back.likes.entity.Likes;
import com.fastarm.back.likes.repository.LikesRepository;
import com.fastarm.back.member.entity.Member;
import com.fastarm.back.member.exception.MemberNotFoundException;
import com.fastarm.back.member.repository.MemberRepository;
import com.fastarm.back.song.entity.Song;
import com.fastarm.back.team.entity.Team;
import com.fastarm.back.team.exception.TeamNotFoundException;
import com.fastarm.back.team.repository.TeamRepository;
import com.fastarm.back.team.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final PersonalSingHistoryRepository personalSingHistoryRepository;
    private final TeamSingHistoryRepository teamSingHistoryRepository;
    private final MemberRepository memberRepository;
    private final LikesRepository likesRepository;
    private final TeamRepository teamRepository;
    private final TeamService teamService;

    @Transactional(readOnly = true)
    public List<MostSongsResponse> findMostSongsList(String loginId) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(MemberNotFoundException::new);
        return personalSingHistoryRepository.personalMostSongsInfo(member);
    }

    @Transactional(readOnly = true)
    public List<MostSingersResponse> findMostSingersList(String loginId) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(MemberNotFoundException::new);
        return personalSingHistoryRepository.personalMostSingersInfo(member);
    }

    @Transactional(readOnly = true)
    public List<String> findMostGenreList(String loginId) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(MemberNotFoundException::new);
        return personalSingHistoryRepository.personalMostGenreInfo(member);
    }

    @Transactional(readOnly = true)
    public List<MyRecentSongsResponse> findMyRecentSongsList(String loginId) {

        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(MemberNotFoundException::new);

        List<Song> songs = personalSingHistoryRepository.findByMember(member);

        List<Likes> likes = likesRepository.findByMemberAndSongIn(member, songs);

        Map<Long, MyRecentSongsResponse> map = new LinkedHashMap<>();

        for (Song data : songs) {
            map.put(data.getId(), MyRecentSongsResponse.from(data));
        }

        for (Likes like : likes) {
            map.get(like.getSong().getId()).setIsLike(true);
            map.get(like.getSong().getId()).setLikeId(like.getId());
        }

        return map.values().stream().toList();
    }

    @Transactional(readOnly = true)
    public List<TeamRecentSongsResponse> findTeamRecentSongsList(TeamRecentSongsDto teamRecentSongsDto) {

        Member member = memberRepository.findByLoginId(teamRecentSongsDto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        Team team = teamRepository.findById(teamRecentSongsDto.getTeamId())
                .orElseThrow(TeamNotFoundException::new);

        teamService.checkPermission(member, team);

        List<Song> songs = teamSingHistoryRepository.findByTeam(team);

        List<Likes> likes = likesRepository.findByMemberAndSongIn(member, songs);

        Map<Long, TeamRecentSongsResponse> map = new LinkedHashMap<>();

        for (Song data : songs) {
            map.put(data.getId(), TeamRecentSongsResponse.from(data));
        }

        for (Likes like : likes) {
            map.get(like.getSong().getId()).setIsLike(true);
            map.get(like.getSong().getId()).setLikeId(like.getId());
        }

        return map.values().stream().toList();
    }

    @Transactional(readOnly = true)
    public SingDateResponse findSingDateList(SingDateDto singDateDto) {
        Member member = memberRepository.findByLoginId(singDateDto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        LocalDateTime startDate = LocalDateTime.of(singDateDto.getYear(), 1, 1, 0, 0, 0);

        List<LocalDateTime> singDateList = personalSingHistoryRepository.singDateList(member, startDate);

        Set<LocalDate> result = new HashSet<>();
        for (LocalDateTime date : singDateList) {
            result.add(date.toLocalDate());
        }

        return new SingDateResponse(member.getCreatedAt().toLocalDate(), new ArrayList<>(result));
    }

    @Transactional(readOnly = true)
    public List<DateSongsResponse> findDateSongsList(DateSongsDto dateSongsDto) {
        Member member = memberRepository.findByLoginId(dateSongsDto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        LocalDateTime startDate = LocalDateTime.of(dateSongsDto.getYear(), dateSongsDto.getMonth(), dateSongsDto.getDay(), 0, 0, 0);
        LocalDateTime endDate = startDate.plusDays(1);

        List<Song> songs = personalSingHistoryRepository.dateSongsInfo(startDate, endDate);

        List<Likes> likes = likesRepository.findByMemberAndSongIn(member, songs);

        Map<Long, DateSongsResponse> map = new LinkedHashMap<>();

        for (Song data : songs) {
            map.put(data.getId(), DateSongsResponse.from(data));
        }

        for (Likes like : likes) {
            map.get(like.getSong().getId()).setIsLike(true);
            map.get(like.getSong().getId()).setLikeId(like.getId());
        }

        return map.values().stream().toList();
    }

}
