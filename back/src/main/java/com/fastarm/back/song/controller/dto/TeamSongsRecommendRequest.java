package com.fastarm.back.song.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class TeamSongsRecommendRequest {
    private String loginId;
    private Long teamId;

    public static TeamSongsRecommendRequest from(String loginId, Long teamId) {
        return TeamSongsRecommendRequest.builder()
                .loginId(loginId)
                .teamId(teamId)
                .build();
    }

}

