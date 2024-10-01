package com.fastarm.back.basedata.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PopularGetResponse {
    private Long id;
    private String coverImage;
    private String title;
    private String singer;
}
