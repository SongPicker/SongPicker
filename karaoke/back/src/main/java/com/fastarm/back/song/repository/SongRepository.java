package com.fastarm.back.song.repository;

import com.fastarm.back.song.entity.Song;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SongRepository extends JpaRepository<Song, Long> {
    Optional<Song> findByNumber(int number);
}
