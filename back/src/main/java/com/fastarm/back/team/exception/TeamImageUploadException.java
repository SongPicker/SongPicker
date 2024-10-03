package com.fastarm.back.team.exception;

import com.fastarm.back.common.exception.CustomException;

public class TeamImageUploadException extends CustomException {
    public TeamImageUploadException() {
        super(TeamExceptionConstants.TEAM_IMAGE_UPLOAD);
    }
}
