package com.derdimet.api;

import com.derdimet.entity.Message;
import java.time.LocalDateTime;

public record ChatMessageResponse(
        Long id,
        Long senderId,
        String senderName,
        String text,
        LocalDateTime createdAt,
        LocalDateTime readAt) {

    public static ChatMessageResponse fromEntity(Message m) {
        var s = m.getSender();
        return new ChatMessageResponse(
                m.getId(),
                s != null ? s.getId() : null,
                s != null ? s.getName() : null,
                m.getText(),
                m.getCreatedAt(),
                m.getReadAt());
    }
}

