package com.derdimet.api;

import com.derdimet.entity.User;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.NotificationPreferencesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/me/notifications")
@RequiredArgsConstructor
public class NotificationPreferencesController {

    private final NotificationPreferencesService notificationPreferencesService;
    private final UserRepository userRepository;

    @GetMapping("/preferences")
    public NotificationPreferencesResponse get(@AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return notificationPreferencesService.get(user);
    }

    @PutMapping("/preferences")
    public NotificationPreferencesResponse update(
            @AuthenticationPrincipal UserDetails principal,
            @RequestBody UpdateNotificationPreferencesRequest body) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return notificationPreferencesService.update(user, body);
    }

    @PostMapping("/device-tokens")
    public ResponseEntity<MessageResponse> registerToken(
            @AuthenticationPrincipal UserDetails principal, @Valid @RequestBody RegisterDeviceTokenRequest body) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        notificationPreferencesService.registerDeviceToken(user, body);
        return ResponseEntity.ok(new MessageResponse("Cihaz kaydedildi"));
    }

    @DeleteMapping("/device-tokens")
    public ResponseEntity<MessageResponse> removeToken(
            @AuthenticationPrincipal UserDetails principal, @RequestParam String token) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        notificationPreferencesService.removeDeviceToken(user, token);
        return ResponseEntity.ok(new MessageResponse("Cihaz kaldırıldı"));
    }
}
