package com.fastarm.back.history.controller.dto;

import com.fastarm.back.song.entity.Song;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamRecentSongsResponse {

    private long songId;
    private int number;
    private String coverImage;
    private String title;
    private String singer;
    @Builder.Default
    private Boolean isLike = false;
    private Long likeId;

    public static TeamRecentSongsResponse from(Song song) {
        return TeamRecentSongsResponse.builder()
                .songId(song.getId())
                .number(song.getNumber())
                .coverImage(song.getCoverImage())
                .title(song.getTitle())
                .singer(song.getSinger())
                .build();
    }

}
