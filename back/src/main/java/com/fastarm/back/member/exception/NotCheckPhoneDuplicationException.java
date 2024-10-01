package com.fastarm.back.member.exception;

import com.fastarm.back.common.exception.CustomException;

public class NotCheckPhoneDuplicationException extends CustomException {
    public NotCheckPhoneDuplicationException() {
        super(MemberExceptionConstants.NOT_CHECK_PHONE_DUPLICATE);
    }
}

