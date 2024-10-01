package com.fastarm.back.member.exception;

import com.fastarm.back.common.exception.CustomException;

public class ProfileImageModificationException extends CustomException {
    public ProfileImageModificationException() {
        super(MemberExceptionConstants.CANNOT_MODIFY_PROFILE_IMAGE);
    }
}
