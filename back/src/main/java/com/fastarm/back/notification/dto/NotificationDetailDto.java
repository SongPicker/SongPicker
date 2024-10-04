package com.fastarm.back.notification.dto;

import com.fastarm.back.team.dto.TeamDetailMemberDto;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class NotificationDetailDto {
    private String teamImage;
    private String teamName;
    private int teamMemberCnt;
    private List<TeamDetailMemberDto> members;
    
}



