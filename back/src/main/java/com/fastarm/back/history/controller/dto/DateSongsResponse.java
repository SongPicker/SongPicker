package com.fastarm.back.history.controller.dto;

import com.fastarm.back.song.entity.Song;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class DateSongsResponse {
    private int number;
    private String coverImage;
    private String title;
    private String singer;
    @Builder.Default
    private Boolean isLike = false;
    private Long likeId;

    public static DateSongsResponse from(Song song) {
        return DateSongsResponse.builder()
                .number(song.getNumber())
                .coverImage(song.getCoverImage())
                .title(song.getTitle())
                .singer(song.getSinger())
                .build();
    }
}
