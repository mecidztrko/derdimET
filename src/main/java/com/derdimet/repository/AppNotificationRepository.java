package com.derdimet.repository;

import com.derdimet.entity.AppNotification;
import com.derdimet.entity.NotificationType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AppNotificationRepository extends JpaRepository<AppNotification, Long> {

    List<AppNotification> findByUser_IdOrderByCreatedAtDesc(Long userId);

    @Query(
            """
            SELECT n FROM AppNotification n
            WHERE n.user.id = :userId
              AND (:type IS NULL OR n.type = :type)
              AND (:unreadOnly = false OR n.readAt IS NULL)
            ORDER BY n.createdAt DESC
            """)
    List<AppNotification> findInbox(
            @Param("userId") Long userId,
            @Param("type") NotificationType type,
            @Param("unreadOnly") boolean unreadOnly);

    long countByUser_IdAndReadAtIsNull(Long userId);

    @Modifying
    @Query("UPDATE AppNotification n SET n.readAt = CURRENT_TIMESTAMP WHERE n.user.id = :userId AND n.readAt IS NULL")
    int markAllRead(@Param("userId") Long userId);
}
