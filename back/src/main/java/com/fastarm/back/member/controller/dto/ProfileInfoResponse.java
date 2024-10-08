package com.fastarm.back.member.controller.dto;

import com.fastarm.back.member.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileInfoResponse {
    private String nickname;
    private String profileImage;
    private String name;
    private Gender gender;
    private String phone;
    private String loginId;
}
