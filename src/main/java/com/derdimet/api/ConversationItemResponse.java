package com.derdimet.api;

import com.derdimet.entity.Conversation;
import java.time.LocalDateTime;

public record ConversationItemResponse(
        Long conversationId,
        Long otherUserId,
        String otherUserName,
        String otherUserEmail,
        String otherUserRole,
        LocalDateTime lastMessageAt) {

    public static ConversationItemResponse fromEntity(Conversation c, Long currentUserId) {
        var u1 = c.getUser1();
        var u2 = c.getUser2();
        var other = (u1 != null && u1.getId() != null && u1.getId().equals(currentUserId)) ? u2 : u1;
        return new ConversationItemResponse(
                c.getId(),
                other != null ? other.getId() : null,
                other != null ? other.getName() : null,
                other != null ? other.getEmail() : null,
                other != null && other.getRole() != null ? other.getRole().name() : null,
                c.getLastMessageAt());
    }
}

