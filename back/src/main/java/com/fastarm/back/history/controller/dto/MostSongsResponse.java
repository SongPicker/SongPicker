package com.fastarm.back.history.controller.dto;

import com.fastarm.back.history.dto.MostSongsListDto;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MostSongsResponse {
    private int totalCount;
    private List<MostSongsListDto> mostSongsList;

    public static MostSongsResponse from(int count, List<MostSongsListDto> list) {
        return MostSongsResponse.builder()
                .totalCount(count)
                .mostSongsList(list)
                .build();
    }
}
