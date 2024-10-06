package com.fastarm.back.notification.exception;

import com.fastarm.back.common.exception.ExceptionConstants;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum NotificationExceptionConstants implements ExceptionConstants {
    ALREADY_INVITE("NO000", "이미 수락한 사용자", HttpStatus.CONFLICT),
    TEAM_INVITE_NOTIFICATION_NOT_FOUND("NO001","그룹 초대 알림 조회 실패",HttpStatus.BAD_REQUEST),
    NOTIFICATION_NOT_FOUND("NO002","알림 조회 실패",HttpStatus.BAD_REQUEST),
    FIREBASE_MESSAGING("NO003", "푸시 알림 전송 실패", HttpStatus.BAD_REQUEST);

    final String code;
    final String message;
    final HttpStatus httpStatus;

}
