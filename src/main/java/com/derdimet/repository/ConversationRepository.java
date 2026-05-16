package com.derdimet.repository;

import com.derdimet.entity.Conversation;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @EntityGraph(attributePaths = {"user1", "user2"})
    List<Conversation> findByUser1_IdOrUser2_IdOrderByLastMessageAtDesc(Long userId1, Long userId2);

    Optional<Conversation> findByUser1_IdAndUser2_Id(Long user1Id, Long user2Id);
}

