package com.derdimet.repository;

import com.derdimet.entity.NotificationPreferences;
import com.derdimet.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationPreferencesRepository extends JpaRepository<NotificationPreferences, Long> {

    Optional<NotificationPreferences> findByUser(User user);

    Optional<NotificationPreferences> findByUser_Id(Long userId);
}
