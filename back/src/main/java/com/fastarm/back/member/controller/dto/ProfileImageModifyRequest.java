package com.fastarm.back.member.controller.dto;

import com.fastarm.back.member.dto.ProfileImageModifyDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileImageModifyRequest {
    private MultipartFile profileImage;

    public ProfileImageModifyDto toDto(String loginId) {
        return ProfileImageModifyDto.builder()
                .profileImage(profileImage)
                .loginId(loginId)
                .build();
    }
}
