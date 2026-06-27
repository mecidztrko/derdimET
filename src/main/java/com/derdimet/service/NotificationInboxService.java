package com.derdimet.service;

import com.derdimet.api.NotificationInboxItemResponse;
import com.derdimet.entity.NotificationType;
import com.derdimet.entity.User;
import com.derdimet.repository.AppNotificationRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationInboxService {

    private final AppNotificationRepository notificationRepository;
    private final InboxNotificationService inboxNotificationService;

    @Transactional(readOnly = true)
    public List<NotificationInboxItemResponse> listInbox(User user, NotificationType type, boolean unreadOnly) {
        return notificationRepository.findInbox(user.getId(), type, unreadOnly).stream()
                .map(NotificationInboxItemResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public long unreadCount(User user) {
        return notificationRepository.countByUser_IdAndReadAtIsNull(user.getId());
    }

    @Transactional
    public void markRead(User user, Long notificationId) {
        inboxNotificationService.markRead(user, notificationId);
    }

    @Transactional
    public int markAllRead(User user) {
        return inboxNotificationService.markAllRead(user);
    }
}
