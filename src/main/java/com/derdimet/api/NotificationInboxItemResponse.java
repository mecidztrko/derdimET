package com.derdimet.api;

import com.derdimet.entity.NotificationType;
import com.derdimet.entity.AppNotification;
import java.time.LocalDateTime;

public record NotificationInboxItemResponse(
        Long id,
        NotificationType type,
        String title,
        String body,
        String link,
        boolean read,
        LocalDateTime createdAt) {

    public static NotificationInboxItemResponse fromEntity(AppNotification n) {
        return new NotificationInboxItemResponse(
                n.getId(),
                n.getType(),
                n.getTitle(),
                n.getBody(),
                n.getLink(),
                n.getReadAt() != null,
                n.getCreatedAt());
    }
}
