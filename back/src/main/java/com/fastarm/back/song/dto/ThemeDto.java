package com.fastarm.back.song.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThemeDto {

    private String themeTitle;
    private List<SongDto> songList;

    public static ThemeDto from(String themeTitle, List<SongDto> list) {
        return ThemeDto.builder()
                .themeTitle(themeTitle)
                .songList(list)
                .build();
    }

}
