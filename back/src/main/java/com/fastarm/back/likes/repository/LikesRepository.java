package com.fastarm.back.likes.repository;

import com.fastarm.back.likes.controller.dto.LikesListResponse;
import com.fastarm.back.likes.entity.Likes;
import com.fastarm.back.member.entity.Member;
import com.fastarm.back.song.entity.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface LikesRepository extends JpaRepository<Likes, Long> {

    Optional<Likes> findByMemberAndSong(Member member, Song song);

    @Query(
            """
            SELECT new com.fastarm.back.likes.controller.dto.LikesListResponse(
            s.number, s.coverImage, s.title, s.singer, lk.id
            )
            FROM Likes lk
            JOIN lk.song s
            WHERE lk.member.loginId = :loginId
            """
    )
    List<LikesListResponse> likesListInfo(String loginId);

    List<Likes> findByMemberAndSongIn(Member member, List<Song> song);

}
