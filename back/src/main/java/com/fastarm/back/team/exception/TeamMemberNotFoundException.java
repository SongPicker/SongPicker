package com.fastarm.back.team.exception;


import com.fastarm.back.common.exception.CustomException;

public class TeamMemberNotFoundException extends CustomException {
    public TeamMemberNotFoundException() {
        super(TeamExceptionConstants.TEAM_MEMBER_NOT_FOUND);

    }

}
