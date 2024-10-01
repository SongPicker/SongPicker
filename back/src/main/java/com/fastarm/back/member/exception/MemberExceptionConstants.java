package com.fastarm.back.member.exception;

import com.fastarm.back.common.exception.ExceptionConstants;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum MemberExceptionConstants implements ExceptionConstants {

    LOGIN_DUPLICATE("ME001", "로그인 아이디 중복 검사 실패", HttpStatus.CONFLICT),
    NICKNAME_DUPLICATE("ME003", "닉네임 중복 검사 실패", HttpStatus.CONFLICT),
    PHONE_DUPLICATE("ME004", "전화번호 중복 검사 실패", HttpStatus.CONFLICT),
    CANNOT_MODIFY_PASSWORD("ME006", "비밀번호 수정 실패", HttpStatus.BAD_REQUEST),
    LOGIN_ID_PHONE_MISMATCH("ME007", "로그인 아이디 전화번호 불일치", HttpStatus.BAD_REQUEST),
    NOT_CHECK_PHONE_DUPLICATE("ME008", "전화번호 중복 검사 미실시", HttpStatus.BAD_REQUEST),
    MEMBER_NOT_FOUND("ME009", "사용자 조회 실패", HttpStatus.BAD_REQUEST),
    NOT_CHECK_LOGIN_ID_DUPLICATE("ME000", "로그인 아이디 중복 검사 미실시", HttpStatus.BAD_REQUEST),
    NOT_CHECK_NICKNAME_DUPLICATE("ME002", "닉네임 중복 검사 미실시", HttpStatus.BAD_REQUEST),
    CANNOT_MODIFY_PROFILE_IMAGE("ME010", "프로필 사진 수정 실패", HttpStatus.BAD_REQUEST);

    final String code;
    final String message;
    final HttpStatus httpStatus;
}

