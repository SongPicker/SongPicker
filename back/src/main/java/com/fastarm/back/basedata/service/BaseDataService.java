package com.fastarm.back.basedata.service;

import com.fastarm.back.basedata.constants.BaseDataConstants;
import com.fastarm.back.basedata.controller.dto.PopularGetResponse;
import com.fastarm.back.basedata.dto.BaseDataAddDto;
import com.fastarm.back.basedata.entity.BaseData;
import com.fastarm.back.basedata.exception.CannotSaveBaseDataException;
import com.fastarm.back.basedata.repository.BaseDataRepository;
import com.fastarm.back.member.entity.Member;
import com.fastarm.back.member.exception.MemberNotFoundException;
import com.fastarm.back.member.repository.MemberRepository;
import com.fastarm.back.song.entity.Song;
import com.fastarm.back.song.repository.SongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
public class BaseDataService {

    private final SongRepository songRepository;
    private final BaseDataRepository baseDataRepository;
    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public Slice<PopularGetResponse> getPopularList(Pageable pageable) {
        return songRepository.getPopularSongs(pageable);
    }

    @Transactional
    public void addBaseData(BaseDataAddDto baseDataAddDto) {
        if (baseDataAddDto.getIds().size() < BaseDataConstants.MINIMUM_CHOICE) {
            throw new CannotSaveBaseDataException();
        }

        Member member = memberRepository.findByLoginId(baseDataAddDto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        List<Song> songs = songRepository.findAllById(baseDataAddDto.getIds());

        baseDataRepository.saveAll(songs.stream()
                .map(song -> BaseData.builder()
                        .song(song)
                        .member(member)
                        .build()).toList());
    }
}
