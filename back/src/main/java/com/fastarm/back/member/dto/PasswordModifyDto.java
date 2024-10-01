package com.fastarm.back.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PasswordModifyDto {
    private String newPassword;
    private String checkPassword;
    private String loginId;
}
