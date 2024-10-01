package com.fastarm.back.team.exception;

import com.fastarm.back.common.exception.CustomException;

public class TeamNotFoundException extends CustomException {
    public TeamNotFoundException() {
        super(TeamExceptionConstants.TEAM_NOT_FOUND);
    }
}
