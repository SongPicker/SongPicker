package com.fastarm.back.auth.exception;

import com.fastarm.back.common.exception.CustomException;

public class PasswordAuthenticationException extends CustomException {
    public PasswordAuthenticationException() {
        super(AuthExceptionConstants.PASSWORD_AUTH_FAIL);
    }
}
