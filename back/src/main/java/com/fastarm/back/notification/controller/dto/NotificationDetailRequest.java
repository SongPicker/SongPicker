package com.fastarm.back.notification.controller.dto;

import com.fastarm.back.notification.enums.Type;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NotificationDetailRequest {
    private Long notificationId;
    private String loginId;

}
