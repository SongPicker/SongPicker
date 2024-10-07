package com.fastarm.back.song.controller;

import com.fastarm.back.auth.security.dto.LoginMemberInfo;
import com.fastarm.back.common.controller.dto.ApiResponse;
import com.fastarm.back.song.controller.dto.SongDetailRequest;
import com.fastarm.back.song.controller.dto.SongSearchRequest;
import com.fastarm.back.song.controller.dto.SongSearchResponse;
import com.fastarm.back.song.controller.dto.TeamSongsRecommendRequest;
import com.fastarm.back.song.dto.SongDetailDto;
import com.fastarm.back.song.dto.SongDto;

import com.fastarm.back.song.dto.ThemeDto;
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


    @GetMapping("/theme-total")
    public ResponseEntity<?> themeTotalList(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        List<ThemeDto> result = songService.getThemeTotalList(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("SO104", "전체 테마 노래 추천 성공", result));
    }
}
