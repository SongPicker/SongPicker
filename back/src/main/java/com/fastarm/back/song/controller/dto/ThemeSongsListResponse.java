package com.fastarm.back.song.controller.dto;

import com.fastarm.back.song.dto.SongDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ThemeSongsListResponse {
    private String themeTitle;
    private List<SongDto> list;
}
