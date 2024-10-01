package com.fastarm.back.auth.exception;

import com.fastarm.back.common.exception.ExceptionConstants;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum AuthExceptionConstants implements ExceptionConstants {

    NOT_CHECK_PHONE_AUTH("AU001", "전화번호 인증 미실시", HttpStatus.BAD_REQUEST),
    PHONE_AUTH_CODE_MISMATCH("AU002", "전화번호 인증 실패", HttpStatus.BAD_REQUEST),
    NOT_CHECK_PASSWORD_AUTH("AU003", "비밀번호 인증 미실시", HttpStatus.BAD_REQUEST),
    PASSWORD_AUTH_FAIL("AU004", "비밀번호 인증 실패", HttpStatus.BAD_REQUEST),
    REFRESH_AUTH_FAIL("AU007", "리프레시 토큰 인증 실패", HttpStatus.UNAUTHORIZED);


    final String code;
    final String message;
    final HttpStatus httpStatus;
}

