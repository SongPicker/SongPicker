package com.fastarm.back.notification.controller;

import com.fastarm.back.auth.security.dto.LoginMemberInfo;
import com.fastarm.back.common.controller.dto.ApiResponse;
import com.fastarm.back.notification.controller.dto.NotificationDetailRequest;
import com.fastarm.back.notification.controller.dto.NotificationRequest;
import com.fastarm.back.notification.controller.dto.NotificationResponse;
import com.fastarm.back.notification.controller.dto.TeamInviteNotificationRequest;
import com.fastarm.back.notification.dto.NotificationDetailDto;
import com.fastarm.back.notification.dto.NotificationDto;
import com.fastarm.back.notification.enums.Type;
import com.fastarm.back.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<?> notificationListFind(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        List<NotificationResponse> notifications = notificationService.findNotificationList(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("NO103","알림 목록 조회 성공",notifications));
    }

    @GetMapping("/{notificationId}")
    public ResponseEntity<?> notificationDetailFind(@PathVariable Long notificationId,
                                                @AuthenticationPrincipal LoginMemberInfo loginMemberInfo){

        NotificationDetailDto notificationResponse = notificationService.findNotificationDetail(NotificationDetailRequest.builder()
                    .notificationId(notificationId)
                    .loginId(loginMemberInfo.getLoginId())
                    .build()
        );

        return ResponseEntity.ok(new ApiResponse<>("NO104","알림 상세 조회 성공",notificationResponse));
    }

    @GetMapping("/read")
    public ResponseEntity<?> unReadNotificationCheck(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        Boolean result = notificationService.checkUnreadNotification(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("NO105", "읽지 않은 알림 조회 성공", result));
    }
    @PostMapping("/response")
    public ResponseEntity<?> teamInvitationRespond(@RequestBody TeamInviteNotificationRequest teamInviteNotificationRequest,
                                                   @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        notificationService.respondTeamInvitation(teamInviteNotificationRequest.toDto(loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("NO100","그룹 초대 응답 성공",null));
    }

    @PutMapping("/read")
    public ResponseEntity<?> notificationRead(@RequestBody NotificationRequest notificationRequest,
                                              @AuthenticationPrincipal LoginMemberInfo loginMemberInfo){
        notificationService.readNotification(notificationRequest.toDto(loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("NO101","알림 읽기 성공",null));
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<?> notificationRemove(@PathVariable Long notificationId,
                                                @AuthenticationPrincipal LoginMemberInfo loginMemberInfo){
        notificationService.removeNotification(NotificationDto.of(notificationId,loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("NO102","알림 삭제 성공",null));
    }

}
