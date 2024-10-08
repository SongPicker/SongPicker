package com.fastarm.back.song.controller.dto;

import com.fastarm.back.song.dto.ThemeSongsDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RandomThemeSongsResponse {
    private ThemeSongsDto firstTheme;
    private ThemeSongsDto secondTheme;
}
