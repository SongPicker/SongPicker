package com.fastarm.back.likes.service;

import com.fastarm.back.likes.controller.dto.LikesListResponse;
import com.fastarm.back.likes.dto.LikesAddDto;
import com.fastarm.back.likes.dto.LikesRemoveDto;
import com.fastarm.back.likes.entity.Likes;
import com.fastarm.back.likes.exception.AlreadyLikeException;
import com.fastarm.back.likes.exception.CannotRemoveLikeException;
import com.fastarm.back.likes.repository.LikesRepository;
import com.fastarm.back.member.entity.Member;
import com.fastarm.back.member.exception.MemberNotFoundException;
import com.fastarm.back.member.repository.MemberRepository;
import com.fastarm.back.song.entity.Song;
import com.fastarm.back.song.exception.NotFoundSongException;
import com.fastarm.back.song.repository.SongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LikesService {

    private final LikesRepository likesRepository;
    private final MemberRepository memberRepository;
    private final SongRepository songRepository;

    @Transactional
    public void addLikes(LikesAddDto likesAddDto) {
        Member member = memberRepository.findByLoginId(likesAddDto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        Song song = songRepository.findById(likesAddDto.getSongId())
                .orElseThrow(NotFoundSongException::new);

        if (likesRepository.findByMemberAndSong(member, song).isPresent()) {
            throw new AlreadyLikeException();
        }

        likesRepository.save(likesAddDto.toEntity(member, song));
    }

    @Transactional
    public void removeLikes(LikesRemoveDto likesRemoveDto) {
        Member member = memberRepository.findByLoginId(likesRemoveDto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        Song song = songRepository.findByNumber(likesRemoveDto.getSongNumber())
                .orElseThrow(NotFoundSongException::new);

        Likes like = likesRepository.findByMemberAndSong(member, song)
                .orElseThrow(CannotRemoveLikeException::new);

        likesRepository.delete(like);
    }

    @Transactional(readOnly = true)
    public List<LikesListResponse> findLikesList(String loginId) {
        return likesRepository.likesListInfo(loginId);
    }

}
