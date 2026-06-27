package com.derdimet.service;

import com.derdimet.entity.AppNotification;
import com.derdimet.entity.NotificationType;
import com.derdimet.entity.User;
import com.derdimet.repository.AppNotificationRepository;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InboxNotificationService {

    private final AppNotificationRepository notificationRepository;

    @Transactional
    public void create(User user, NotificationType type, String title, String body, String link) {
        AppNotification n = new AppNotification();
        n.setUser(user);
        n.setType(type);
        n.setTitle(title);
        n.setBody(body);
        n.setLink(link);
        notificationRepository.save(n);
    }

    @Transactional
    public void markRead(User user, Long notificationId) {
        AppNotification n =
                notificationRepository
                        .findById(notificationId)
                        .filter(item -> item.getUser().getId().equals(user.getId()))
                        .orElseThrow(() -> new IllegalArgumentException("Bildirim bulunamadı"));
        if (n.getReadAt() == null) {
            n.setReadAt(LocalDateTime.now());
            notificationRepository.save(n);
        }
    }

    @Transactional
    public int markAllRead(User user) {
        return notificationRepository.markAllRead(user.getId());
    }
}
