package com.fastarm.back.song.repository;

import com.fastarm.back.basedata.controller.dto.PopularGetResponse;
import com.fastarm.back.song.entity.Song;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;


public interface SongRepository extends JpaRepository<Song, Long> , SongRepositoryCustom{


    @Query("""
        SELECT s.id
        FROM Song s
        WHERE s.title LIKE %:keyword%
        ORDER BY CASE
        WHEN s.title LIKE :keyword THEN 0
        WHEN s.title LIKE :keyword% THEN 1
        WHEN s.title LIKE %:keyword THEN 2
        WHEN s.title LIKE %:keyword% THEN 3
        ELSE 4
        END
        """)
    List<Long> findTitleByKeyword(@Param("keyword") String keyword);

    @Query("""
        SELECT s.id
        FROM Song s
        WHERE s.singer LIKE %:keyword%
        ORDER BY CASE 
        WHEN s.singer LIKE :keyword THEN 0
        WHEN s.singer LIKE :keyword% THEN 1
        WHEN s.singer LIKE %:keyword THEN 2
        WHEN s.singer LIKE %:keyword% THEN 3
        ELSE 4
        END
        """)
    List<Long> findSingerByKeyword(@Param("keyword") String keyword);

    List<Song> findByNumberIn(List<Integer> numbers);

    Optional<Song> findByNumber(int number);

    @Query("""
        SELECT new com.fastarm.back.basedata.controller.dto.PopularGetResponse(
            s.id,
            s.coverImage,
            s.title,
            s.singer
        )
        FROM Song s
        WHERE s.isPopular = true
    """
    )
    List<PopularGetResponse> getPopularSongs();

    @Query(value = "SELECT * FROM song WHERE genre = :genre ORDER BY RAND() LIMIT 20", nativeQuery = true)
    List<Song> findByGenre(String genre);
}
