package com.fastarm.back.song.dto;

import com.fastarm.back.song.enums.Theme;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThemeSongsDto {
    private Theme theme;
    private List<SongDto> songDtoList;
}
