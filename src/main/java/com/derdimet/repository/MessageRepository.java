package com.derdimet.repository;

import com.derdimet.entity.Message;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @EntityGraph(attributePaths = {"sender"})
    List<Message> findByConversation_IdOrderByCreatedAtAsc(Long conversationId);

    long countByConversation_Id(Long conversationId);

    long countByConversation_IdAndSender_IdNotAndReadAtIsNull(Long conversationId, Long senderId);

    @Query(
            """
            SELECT COUNT(m) FROM Message m
            WHERE (m.conversation.user1.id = :userId OR m.conversation.user2.id = :userId)
              AND m.sender.id <> :userId
              AND m.readAt IS NULL
            """)
    long countUnreadForUser(@Param("userId") Long userId);

    @Modifying
    @Query(
            """
            UPDATE Message m SET m.readAt = :readAt
            WHERE m.conversation.id = :conversationId
              AND m.sender.id <> :readerId
              AND m.readAt IS NULL
            """)
    int markAsReadForRecipient(
            @Param("conversationId") Long conversationId,
            @Param("readerId") Long readerId,
            @Param("readAt") LocalDateTime readAt);
}

