package com.fastarm.back.song.controller;

import com.fastarm.back.auth.security.dto.LoginMemberInfo;
import com.fastarm.back.common.controller.dto.ApiResponse;
import com.fastarm.back.song.controller.dto.*;
import com.fastarm.back.song.dto.SongDetailDto;
import com.fastarm.back.song.dto.SongDto;

import com.fastarm.back.song.service.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/songs")
@RequiredArgsConstructor
public class SongController {
    private final SongService songService;

    @GetMapping("/{songId}")
    public ResponseEntity<?> getSongDetails(@PathVariable Long songId, @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {

        SongDetailDto songDetail = songService.getSongDetails(SongDetailRequest.from(songId, loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("SO100", "노래 상세 조회 성공", songDetail));

    }
    @GetMapping("/my/recommendations")
    public ResponseEntity<?> mySongsRecommend(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo){
        songService.recommendMySong(loginMemberInfo.getLoginId());
        List<SongDto> songRecommendDtos = songService.recommendMySong(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("SO102","선곡 추천 성공",songRecommendDtos));
    }


    @GetMapping("/team/recommendations")
    public ResponseEntity<?> teamSongsRecommend(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo,
                                                @RequestParam("teamId") Long teamId){
        List<SongDto> songRecommendDtos = songService.recommendTeamSong(TeamSongsRecommendRequest.from(loginMemberInfo.getLoginId(),teamId));
        return ResponseEntity.ok(new ApiResponse<>("SO102","선곡 추천 성공",songRecommendDtos));
    }


    @GetMapping("/search")
    public ResponseEntity<?> songsSearch(@RequestParam String keyword, @AuthenticationPrincipal LoginMemberInfo loginMemberInfo){
        SongSearchResponse songSearchResponse = songService.searchSongs(SongSearchRequest.from(keyword, loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("SO101","노래 검색 성공",songSearchResponse));
    }

    @GetMapping("/themes-total")
    public ResponseEntity<?> themeTotalList() {
        List<String> result = songService.findThemeTotalList();
        return ResponseEntity.ok(new ApiResponse<>("SO104", "테마 리스트 전체 조회 성공", result));
    }

    @GetMapping
    public ResponseEntity<?> themeSongsList(@RequestParam("theme") String genre,
                                            @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        ThemeSongsListResponse result = songService.findThemeSongsList(genre, loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("SO105", "테마별 노래 리스트 조회 성공", result));
    }

    @GetMapping("/themes-random")
    public ResponseEntity<?> themeRandomList() {
        List<String> result = songService.findThemeRandomList();
        return ResponseEntity.ok(new ApiResponse<>("SO106", "테마 리스트 랜덤 조회 성공", result));
    }
}
