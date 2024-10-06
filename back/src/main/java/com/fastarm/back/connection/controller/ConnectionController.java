package com.fastarm.back.connection.controller;

import com.fastarm.back.auth.security.dto.LoginMemberInfo;
import com.fastarm.back.common.controller.dto.ApiResponse;
import com.fastarm.back.connection.controller.dto.ConnectionRequest;
import com.fastarm.back.connection.controller.dto.ConnectionStatusGetResponse;
import com.fastarm.back.connection.controller.dto.TeamConnectionRequest;
import com.fastarm.back.connection.controller.dto.ReservationRequest;
import com.fastarm.back.connection.dto.ConnectionDto;
import com.fastarm.back.connection.dto.TeamConnectionDto;
import com.fastarm.back.connection.dto.ReservationDto;
import com.fastarm.back.connection.service.ConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/connections")
@RequiredArgsConstructor
public class ConnectionController {

    private final ConnectionService connectionService;

    @PostMapping
    public ResponseEntity<?> connectionSet(@RequestBody ConnectionRequest connectionRequest,
                                           @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        connectionService.setConnection(ConnectionDto.builder()
                            .serialNumber(connectionRequest.getSerialNumber())
                            .loginId(loginMemberInfo.getLoginId())
                            .build());
        return ResponseEntity.ok(new ApiResponse<>("CO100", "서비스 연동 성공", null));
    }

    @PostMapping("/team")
    public ResponseEntity<?> connectionSet(@RequestBody TeamConnectionRequest teamConnectionRequest,
                                           @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        connectionService.setTeamConnection(TeamConnectionDto.builder()
                        .serialNumber(teamConnectionRequest.getSerialNumber())
                        .teamId(teamConnectionRequest.getTeamId())
                        .loginId(loginMemberInfo.getLoginId())
                        .build());
        return ResponseEntity.ok(new ApiResponse<>("CO100", "서비스 연동 성공", null));
    }

    @GetMapping
    public ResponseEntity<?> statusGet(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        ConnectionStatusGetResponse result = connectionService.getConnectionStatus(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("CO102", "서비스 연동 상태 조회 성공", result));
    }

    @DeleteMapping
    public ResponseEntity<?> statusRemove(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        connectionService.removeConnection(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("CO103", "서비스 연동 해지 성공", null));
    }

    @PostMapping("/reservations")
    public ResponseEntity<?> songReserve(@RequestBody ReservationRequest reservationRequest,
                                         @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        connectionService.reserveSong(ReservationDto.builder()
                        .number(reservationRequest.getNumber())
                        .loginId(loginMemberInfo.getLoginId())
                        .build());
        return ResponseEntity.ok(new ApiResponse<>("CO101", "예약 성공", null));
    }
}
