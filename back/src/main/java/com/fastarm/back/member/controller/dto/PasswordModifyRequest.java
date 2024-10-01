package com.fastarm.back.member.controller.dto;

import com.fastarm.back.member.dto.PasswordModifyDto;
import com.fastarm.back.member.validation.annotation.Password;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PasswordModifyRequest {
    private String existPassword;
    @Password
    private String newPassword;
    @Password
    private String checkPassword;

    public PasswordModifyDto toDto(String loginId) {
        return PasswordModifyDto.builder()
                .newPassword(newPassword)
                .checkPassword(checkPassword)
                .loginId(loginId)
                .build();
    }
}
