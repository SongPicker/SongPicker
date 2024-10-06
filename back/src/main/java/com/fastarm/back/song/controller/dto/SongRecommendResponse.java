package com.fastarm.back.song.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SongRecommendResponse {
    private int number;
    private String title;
    private String singer;
}
