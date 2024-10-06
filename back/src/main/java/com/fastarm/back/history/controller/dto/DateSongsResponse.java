package com.fastarm.back.history.controller.dto;

import com.fastarm.back.history.dto.DateSongsListDto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class DateSongsResponse {

    private int count;
    private List<DateSongsListDto> dateSongsListDto;

    public static DateSongsResponse from(int count, List<DateSongsListDto> listDto) {
        return DateSongsResponse.builder()
                .count(count)
                .dateSongsListDto(listDto)
                .build();
    }
}
