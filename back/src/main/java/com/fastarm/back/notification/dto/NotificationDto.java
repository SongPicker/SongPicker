package com.fastarm.back.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private Long notificationId;
    private String loginId;

    public static NotificationDto of(Long notificationId, String loginId) {
        return NotificationDto.builder()
                .notificationId(notificationId)
                .loginId(loginId)
                .build();
    }

}
