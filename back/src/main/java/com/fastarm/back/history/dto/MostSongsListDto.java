package com.fastarm.back.history.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class MostSongsListDto {

    private String title;
    private String singer;
    private String coverImage;
    private Long count;

}
