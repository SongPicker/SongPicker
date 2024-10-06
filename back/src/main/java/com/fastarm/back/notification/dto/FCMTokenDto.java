package com.fastarm.back.notification.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FCMTokenDto {
    private String token;
    private String loginId;
}
