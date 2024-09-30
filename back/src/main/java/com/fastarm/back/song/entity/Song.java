
package com.fastarm.back.song.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private int number;

    @Column(length = 60, nullable = false)
    private String title;

    @Column(length = 256, nullable = false)
    private String singer;

    @Column(length = 256)
    private String lyricist;

    @Column(length = 256)
    private String composer;

    @Column(nullable = false)
    private LocalDate releasedAt;

    @Column(length = 256, nullable = false)
    private String coverImage;

    @Column(nullable = false)
    private String genre;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String lyrics;

    @Column(nullable = false)
    private int acousticness;

    @Column(nullable = false)
    private int danceability;

    @Column(nullable = false)
    private int energy;

    @Column(nullable = false)
    private int bpm;

    @Column(nullable = false)
    private String tune;

    @Column(nullable = false)
    private int happiness;

    @Column(nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean isPopular;

}
