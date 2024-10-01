package com.fastarm.back.basedata.entity;

import com.fastarm.back.member.entity.Member;
import com.fastarm.back.song.entity.Song;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BaseData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_id")
    private Song song;

    @Builder
    public BaseData(Member member, Song song) {
        this.member = member;
        this.song = song;
    }
}
