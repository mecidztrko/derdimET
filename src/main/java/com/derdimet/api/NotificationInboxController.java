package com.derdimet.api;

import com.derdimet.entity.NotificationType;
import com.derdimet.entity.User;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.NotificationInboxService;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationInboxController {

    private final UserRepository userRepository;
    private final NotificationInboxService notificationInboxService;

    @GetMapping("/inbox")
    public List<NotificationInboxItemResponse> inbox(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(required = false) NotificationType type,
            @RequestParam(required = false, defaultValue = "false") boolean unreadOnly) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return notificationInboxService.listInbox(user, type, unreadOnly);
    }

    @GetMapping("/inbox/unread-count")
    public Map<String, Long> unreadCount(@AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return Map.of("count", notificationInboxService.unreadCount(user));
    }

    @PostMapping("/inbox/{id}/read")
    public void markRead(@AuthenticationPrincipal UserDetails principal, @PathVariable Long id) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        notificationInboxService.markRead(user, id);
    }

    @PostMapping("/inbox/read-all")
    public Map<String, Integer> markAllRead(@AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return Map.of("updated", notificationInboxService.markAllRead(user));
    }
}
