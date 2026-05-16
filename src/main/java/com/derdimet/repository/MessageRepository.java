package com.derdimet.repository;

import com.derdimet.entity.Message;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @EntityGraph(attributePaths = {"sender"})
    List<Message> findByConversation_IdOrderByCreatedAtAsc(Long conversationId);
}

