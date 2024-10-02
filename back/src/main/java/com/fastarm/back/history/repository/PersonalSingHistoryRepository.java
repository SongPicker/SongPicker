package com.fastarm.back.history.repository;

import com.fastarm.back.history.controller.dto.MostSingersResponse;
import com.fastarm.back.history.controller.dto.MostSongsResponse;
import com.fastarm.back.history.entity.PersonalSingHistory;
import com.fastarm.back.member.entity.Member;
import com.fastarm.back.song.entity.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface PersonalSingHistoryRepository extends JpaRepository<PersonalSingHistory, Long> {

    @Query(
            """
            SELECT new com.fastarm.back.history.controller.dto.MostSongsResponse(s.title, s.singer, s.coverImage, COUNT(s))
            FROM PersonalSingHistory ph
            JOIN ph.song s
            WHERE ph.member = :member
            GROUP BY s.id
            ORDER BY COUNT(s) DESC
            LIMIT 3
            """
    )
    List<MostSongsResponse> personalMostSongsInfo(Member member);

    @Query(
            """
            SELECT new com.fastarm.back.history.controller.dto.MostSingersResponse(s.singer, COUNT(s))
            FROM PersonalSingHistory ph
            JOIN ph.song s
            WHERE ph.member = :member
            GROUP BY s.singer
            ORDER BY COUNT(s) DESC
            """
    )
    List<MostSingersResponse> personalMostSingersInfo(Member member);

    @Query(
            """
            SELECT s.genre
            FROM PersonalSingHistory ph
            JOIN ph.song s
            WHERE ph.member = :member
            GROUP BY s.genre
            ORDER BY COUNT(s) DESC
            LIMIT 3
            """
    )
    List<String> personalMostGenreInfo(Member member);

    @Query(
            """
            SELECT ph.song
            FROM PersonalSingHistory ph
            WHERE ph.member = :member
            ORDER BY ph.singAt DESC
            LIMIT 50
            """
    )
    List<Song> findByMember(Member member);

    @Query("""
            SELECT ph.singAt
            FROM PersonalSingHistory ph
            WHERE ph.member = :member AND ph.singAt between :startDate and NOW()
            """)
    List<LocalDateTime> singDateList(Member member, LocalDateTime startDate);

    @Query("""
            SELECT ph.song
            FROM PersonalSingHistory ph
            WHERE ph.singAt between :start and :end
            """)
    List<Song> dateSongsInfo(LocalDateTime start, LocalDateTime end);
}
