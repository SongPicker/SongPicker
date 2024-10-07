package com.fastarm.back.song.dto;

import com.fastarm.back.song.entity.Song;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SongDto {
        private Long songId;
        private int number;
        private String title;
        private String singer;
        private String coverImage;
        @Builder.Default
        private Boolean isLike = false;
        private Long likeId;

        public static SongDto from(Song song) {
                return SongDto.builder()
                        .songId(song.getId())
                        .number(song.getNumber())
                        .title(song.getTitle())
                        .singer(song.getSinger())
                        .coverImage(song.getCoverImage())
                        .build();
        }
}
