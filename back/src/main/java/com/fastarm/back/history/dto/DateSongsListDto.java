package com.fastarm.back.history.dto;

import com.fastarm.back.song.entity.Song;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class DateSongsListDto {
    private int number;
    private String coverImage;
    private String title;
    private String singer;
    @Builder.Default
    private Boolean isLike = false;
    private Long likeId;

    public static DateSongsListDto from(Song song) {
        return DateSongsListDto.builder()
                .number(song.getNumber())
                .coverImage(song.getCoverImage())
                .title(song.getTitle())
                .singer(song.getSinger())
                .build();
    }
}
