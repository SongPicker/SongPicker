package com.fastarm.back.likes.entity;

import com.fastarm.back.member.entity.Member;
import com.fastarm.back.song.entity.Song;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.Hibernate;

import java.util.Objects;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Likes {

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
    public Likes(Member member, Song song) {
        this.member = member;
        this.song = song;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Likes likes = (Likes) o;
        return Objects.equals(this.getMember(), likes.getMember());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(member);
    }

}
