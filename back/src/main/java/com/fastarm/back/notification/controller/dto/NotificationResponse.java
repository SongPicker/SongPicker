package com.fastarm.back.notification.controller.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NotificationResponse {
    private Long notificationId;
    private Boolean isRead;
    private String content;

    public NotificationResponse(Long notificationId, Boolean isRead, String content) {
        this.notificationId = notificationId;
        this.isRead = isRead;
        this.content = content;
    }
}
