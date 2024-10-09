package com.fastarm.back.team.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@Getter
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 32)
    private String name;


    @Column(name = "team_image", length = 256)
    private String teamImage;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

}
