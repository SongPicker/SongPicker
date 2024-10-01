package com.fastarm.back.member.controller.dto;

import com.fastarm.back.member.dto.PasswordFindDto;
import com.fastarm.back.member.validation.annotation.Password;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PasswordFindRequest {
    @Password
    private String newPassword;
    @Password
    private String checkPassword;
    private String phone;
    private String loginId;

    public PasswordFindDto toDto() {
        return PasswordFindDto.builder()
                .newPassword(newPassword)
                .checkPassword(checkPassword)
                .loginId(loginId)
                .build();
    }
}
