package com.fastarm.back.member.exception;

import com.fastarm.back.common.exception.CustomException;

public class PasswordModificationException extends CustomException {
    public PasswordModificationException() {
        super(MemberExceptionConstants.CANNOT_MODIFY_PASSWORD);
    }
}
