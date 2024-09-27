package com.fastarm.back.history.controller;

import com.fastarm.back.auth.security.dto.LoginMemberInfo;
import com.fastarm.back.common.controller.dto.ApiResponse;
import com.fastarm.back.history.controller.dto.TeamRecentSongsResponse;
import com.fastarm.back.history.controller.dto.MostSingersResponse;
import com.fastarm.back.history.controller.dto.MostSongsResponse;
import com.fastarm.back.history.controller.dto.MyRecentSongsResponse;
import com.fastarm.back.history.dto.TeamRecentSongsDto;
import com.fastarm.back.history.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/histories")
public class HistoryController {

    private final HistoryService historyService;

    @GetMapping("/most-songs")
    public ResponseEntity<?> mostSongsList(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        List<MostSongsResponse> result = historyService.findMostSongsList(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("HI100", "가장 많이 부른 곡 조회 성공", result));
    }

    @GetMapping("/most-singers")
    public ResponseEntity<?> mostSingersList(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        List<MostSingersResponse> result = historyService.findMostSingersList(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("HI101", "가장 많이 부른 가수 조회 성공", result));
    }

    @GetMapping("/most-genre")
    public ResponseEntity<?> mostGenreList(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        List<String> result = historyService.findMostGenreList(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("HI102", "가장 많이 부른 장르 조회 성공", result));
    }

    @GetMapping("/my/recent-songs")
    public ResponseEntity<?> myRecentSongsList(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        List<MyRecentSongsResponse> result = historyService.findMyRecentSongsList(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("HI105", "개인 최근 부른 곡 조회 성공", result));
    }

    @GetMapping("/team/recent-songs")
    public ResponseEntity<?> teamRecentSongsList(
            @RequestParam Long teamId,
            @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        List<TeamRecentSongsResponse> result = historyService.findTeamRecentSongsList(new TeamRecentSongsDto(teamId, loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("HI106", "그룹 최근 부른 곡 조회 성공", result));
    }

}
