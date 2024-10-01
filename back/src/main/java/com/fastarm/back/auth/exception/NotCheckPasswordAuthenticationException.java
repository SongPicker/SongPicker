package com.fastarm.back.auth.exception;

import com.fastarm.back.common.exception.CustomException;

public class NotCheckPasswordAuthenticationException extends CustomException {
    public NotCheckPasswordAuthenticationException() {
        super(AuthExceptionConstants.NOT_CHECK_PASSWORD_AUTH);
    }
}
