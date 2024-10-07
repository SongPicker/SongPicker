package com.fastarm.back.song.service;

import com.fastarm.back.likes.entity.Likes;
import com.fastarm.back.likes.repository.LikesRepository;
import com.fastarm.back.member.entity.Member;
import com.fastarm.back.member.repository.MemberRepository;
import com.fastarm.back.song.constants.SongConstants;
import com.fastarm.back.song.controller.dto.*;
import com.fastarm.back.song.dto.SongDetailDto;
import com.fastarm.back.song.dto.SongDto;
import com.fastarm.back.song.entity.Song;
import com.fastarm.back.song.enums.Theme;
import com.fastarm.back.song.exception.NotFoundSongDetailException;
import com.fastarm.back.song.exception.NotFoundSongException;
import com.fastarm.back.song.repository.SongRepository;
import com.fastarm.back.member.exception.MemberNotFoundException;
import com.fastarm.back.team.exception.TeamNotFoundException;
import com.fastarm.back.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class SongService {
    private final SongRepository songRepository;
    private final MemberRepository memberRepository;
    private final RestTemplate restTemplate;
    private final TeamRepository teamRepository;
    private final LikesRepository likesRepository;
    private final Random random = new Random();

    @Transactional
    public List<SongDto> recommendMySong(String loginId) {
        Member member = memberRepository.findByLoginId(loginId).orElseThrow(MemberNotFoundException::new);
        String url = SongConstants.PYTHON_SERVER_URL_INDIVIDUAL + "?memberId=" + member.getId();

        ResponseEntity<List<SongRecommendResponse>> response = restTemplate.exchange(url, HttpMethod.GET, null,
                new ParameterizedTypeReference<List<SongRecommendResponse>>() {});

        List<Integer> songNumbers = response.getBody().stream()
                .map(SongRecommendResponse::getNumber)
                .collect(Collectors.toList());

        List<Song> songs = songRepository.findByNumberIn(songNumbers);
        if (songs.isEmpty()) {
            throw new NotFoundSongException();
        }

        List<Long> songIds = songs.stream()
                .map(Song::getId)
                .collect(Collectors.toList());

        List<SongDto> songDtoList = songRepository.findSongsWithLikeStatus(songIds, member.getId());
        return songDtoList;
    }

    @Transactional
    public List<SongDto> recommendTeamSong(TeamSongsRecommendRequest dto){

        Member member = memberRepository.findByLoginId(dto.getLoginId()).orElseThrow(MemberNotFoundException::new);
        teamRepository.findById(dto.getTeamId()).orElseThrow(TeamNotFoundException::new);


        String url = SongConstants.PYTHON_SERVER_URL_TEAM + "?teamId=" + dto.getTeamId();

        ResponseEntity<List<SongRecommendResponse>> response = restTemplate.exchange(url, HttpMethod.GET, null,
                new ParameterizedTypeReference<List<SongRecommendResponse>>() {});

        if (response == null || response.getBody() == null || response.getBody().isEmpty()) {
            return new ArrayList<>();
        }

        List<Integer> songNumbers = response.getBody().stream()
                .map(SongRecommendResponse::getNumber)
                .collect(Collectors.toList());

        List<Song> songs = songRepository.findByNumberIn(songNumbers);
        if (songs.isEmpty()) {
            throw new NotFoundSongException();
        }

        List<Long> songIds = songs.stream()
                .map(Song::getId)
                .collect(Collectors.toList());

        List<SongDto> songDtoList = songRepository.findSongsWithLikeStatus(songIds, member.getId());
        return songDtoList;
    }

    @Transactional(readOnly = true)
    public SongDetailDto getSongDetails(SongDetailRequest dto) {

        Song song = songRepository.findById(dto.getSongId())
                .orElseThrow(NotFoundSongDetailException::new);

        Member member = memberRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        List<SongDto> songDtoList = songRepository.findSongsWithLikeStatus(List.of(song.getId()), member.getId());
        SongDto songDto = songDtoList.get(0);

        return SongDetailDto.of(songDto, song);
    }


    @Transactional(readOnly = true)
    public SongSearchResponse searchSongs(SongSearchRequest dto){
        Member member = memberRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);


        List<Long> songsByTitle = songRepository.findTitleByKeyword(dto.getKeyword());
        List<SongDto> songResults = songRepository.findSongsWithLikeStatus(songsByTitle, member.getId());

        List<Long> songsBySinger = songRepository.findSingerByKeyword(dto.getKeyword());
        List<SongDto> singerResults = songRepository.findSongsWithLikeStatus(songsBySinger, member.getId());

        return SongSearchResponse.from(songResults, singerResults);
    }

    public List<String> findThemeTotalList() {
        return Arrays.stream(Theme.values())
                .map(Theme::getGenre)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ThemeSongsListResponse findThemeSongsList(String genre, String loginId) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(MemberNotFoundException::new);

        List<Song> songs = songRepository.findByGenre(genre);
        List<Likes> likes = likesRepository.findByMemberAndSongIn(member, songs);

        Map<Long, SongDto> map = new LinkedHashMap<>();

        for (Song data : songs) {
            map.put(data.getId(), SongDto.from(data));
        }

        for (Likes like : likes) {
            map.get(like.getSong().getId()).setIsLike(true);
            map.get(like.getSong().getId()).setLikeId(like.getId());
        }

        List<SongDto> list = map.values().stream().toList();

        String themeTitle = Theme.getThemeTitleByGenre(genre);

        return new ThemeSongsListResponse(themeTitle, list);
    }

    @Transactional(readOnly = true)
    public List<String> findThemeRandomList() {
        List<String> allGenres = findThemeTotalList();

        return random.ints(0, allGenres.size())
                .distinct()
                .limit(2)
                .mapToObj(allGenres::get)
                .collect(Collectors.toList());
    }
}
