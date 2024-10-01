package com.fastarm.back.member.controller.dto;

import com.fastarm.back.member.dto.NicknameModifyDto;
import com.fastarm.back.member.validation.annotation.Nickname;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class NicknameModifyRequest {
    @Nickname
    private String newNickname;

    public NicknameModifyDto toDto(String loginId) {
        return NicknameModifyDto.builder()
                .newNickname(newNickname)
                .loginId(loginId)
                .build();
    }
}
