package com.fastarm.back.team.controller.dto;

import com.fastarm.back.song.controller.dto.SongDetailRequest;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TeamDetailRequest {

  private Long teamId;
    private String loginId;

    public static TeamDetailRequest from(Long teamId, String loginId) {
        return TeamDetailRequest.builder()
                .teamId(teamId)
                .loginId(loginId)
                .build();
    }
}
