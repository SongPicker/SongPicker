package com.fastarm.back.team.exception;

import com.fastarm.back.common.exception.ExceptionConstants;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum TeamExceptionConstants implements ExceptionConstants {
    TEAM_MEMBER_NOT_FOUND("TE000", "그룹원 조회 실패", HttpStatus.BAD_REQUEST),
    TEAM_NOT_FOUND("TE001", "그룹 조회 실패", HttpStatus.BAD_REQUEST);


    final String code;
    final String message;
    final HttpStatus httpStatus;
}
