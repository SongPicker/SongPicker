package com.fastarm.back.auth.controller.dto;

import com.fastarm.back.auth.dto.PasswordVerifyDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PasswordVerifyRequest {
    private String password;

    public PasswordVerifyDto toDto(String loginId) {
        return PasswordVerifyDto.builder()
                .inputPassword(password)
                .loginId(loginId)
                .build();
    }
}
