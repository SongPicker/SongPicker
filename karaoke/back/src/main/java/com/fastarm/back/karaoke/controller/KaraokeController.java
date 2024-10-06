package com.fastarm.back.karaoke.controller;

import com.fastarm.back.common.controller.dto.ApiResponse;
import com.fastarm.back.karaoke.controller.dto.ConnectionFindResponse;
import com.fastarm.back.karaoke.controller.dto.RecommendationResponse;
import com.fastarm.back.karaoke.dto.ChargeDto;
import com.fastarm.back.karaoke.dto.SongStartDto;
import com.fastarm.back.karaoke.service.KaraokeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
public class KaraokeController {

    private final KaraokeService karaokeService;

    @PostMapping("/charge")
    public ResponseEntity<?> charge(@RequestBody ChargeDto chargeDto) {
        karaokeService.charge(chargeDto);
        return ResponseEntity.ok(new ApiResponse<>("KA100", "노래방 결제 성공", null));
    }

    @GetMapping("/reservations")
    public ResponseEntity<?> reservationList(@RequestParam("serialNumber") String serialNumber) {
        List<Object> result = karaokeService.findReservations(serialNumber);
        return ResponseEntity.ok(new ApiResponse<>("KA101", "예약 리스트 조회 성공", result));
    }

    @PostMapping("/start-song")
    public ResponseEntity<?> songStart(@RequestBody SongStartDto songStartDto) {
        karaokeService.startSong(songStartDto);
        return ResponseEntity.ok(new ApiResponse<>("KA103", "노래 시작 성공", null));
    }

    @GetMapping("/connections")
    public ResponseEntity<?> connectionList(@RequestParam("serialNumber") String serialNumber) {
        Set<ConnectionFindResponse> result = karaokeService.findConnections(serialNumber);
        return ResponseEntity.ok(new ApiResponse<>("KA104", "연결 인원 조회 성공", result));
    }

    @GetMapping("/individual/recommendations")
    public ResponseEntity<?> individualRecommendationList(@RequestParam(value = "loginId") String loginId) {
        List<RecommendationResponse> result = karaokeService.findIndividualRecommendations(loginId);
        return ResponseEntity.ok(new ApiResponse<>("KA102", "추천 차트 조회 성공", result));
    }

    @GetMapping("/team/recommendations")
    public ResponseEntity<?> teamRecommendationList(@RequestParam("teamId") Long teamId) {
        List<RecommendationResponse> result = karaokeService.findTeamRecommendations(teamId);
        return ResponseEntity.ok(new ApiResponse<>("KA102", "추천 차트 조회 성공", result));
    }

}
