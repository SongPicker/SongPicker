package com.fastarm.back.song.service;

import com.fastarm.back.member.entity.Member;
import com.fastarm.back.member.repository.MemberRepository;
import com.fastarm.back.song.constants.SongConstants;
import com.fastarm.back.song.controller.dto.*;
import com.fastarm.back.song.dto.SongDetailDto;
import com.fastarm.back.song.dto.SongDto;
import com.fastarm.back.song.entity.Song;
import com.fastarm.back.song.exception.NotFoundSongDetailException;
import com.fastarm.back.song.repository.SongRepository;
import com.fastarm.back.member.exception.MemberNotFoundException;
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



    @Transactional
    public List<SongDto> recommendMySong(String loginId) {
        Member member = memberRepository.findByLoginId(loginId).orElseThrow(MemberNotFoundException::new);
        String url = SongConstants.PYTHON_SERVER_URL_INDIVIDUAL + "?memberId=" + member.getId();

        ResponseEntity<List<SongRecommendResponse>> response = restTemplate.exchange(url, HttpMethod.GET, null,
                new ParameterizedTypeReference<List<SongRecommendResponse>>() {});

        List<Long> songIds = response.getBody().stream()
                .map(SongRecommendResponse::getSongId)
                .collect(Collectors.toList());

        List<SongDto> songDtoList = songRepository.findSongsWithLikeStatus(songIds, member.getId());

        return songDtoList;

    }

    @Transactional
    public List<SongDto> recommendTeamSong(TeamSongsRecommendRequest dto){

        Member member = memberRepository.findByLoginId(dto.getLoginId()).orElseThrow(MemberNotFoundException::new);
        String url = SongConstants.PYTHON_SERVER_URL_TEAM + "?teamId=" + dto.getTeamId();

        ResponseEntity<List<SongRecommendResponse>> response = restTemplate.exchange(url, HttpMethod.GET, null,
                new ParameterizedTypeReference<List<SongRecommendResponse>>() {});

        List<Long> songIds = response.getBody().stream()
                .map(SongRecommendResponse::getSongId)
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
}
