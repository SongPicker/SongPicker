package com.fastarm.back.likes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LikesRemoveDto {

    private int songNumber;
    private String loginId;

}
