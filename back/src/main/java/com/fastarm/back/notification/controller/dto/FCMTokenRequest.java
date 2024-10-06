package com.fastarm.back.notification.controller.dto;

import com.fastarm.back.notification.dto.FCMTokenDto;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FCMTokenRequest {
    private String token;

    public FCMTokenDto toDto(String loginId){
        return FCMTokenDto.builder()
                .token(this.token)
                .loginId(loginId)
                .build();
    }

}
