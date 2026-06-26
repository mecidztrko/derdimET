package com.derdimet.service;

import com.derdimet.config.PushProperties;
import com.derdimet.entity.DeviceToken;
import com.derdimet.entity.NotificationPreferences;
import com.derdimet.entity.User;
import com.derdimet.repository.DeviceTokenRepository;
import com.derdimet.repository.NotificationPreferencesRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class PushNotificationService {

    private final PushProperties pushProperties;
    private final DeviceTokenRepository deviceTokenRepository;
    private final NotificationPreferencesRepository preferencesRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Transactional(readOnly = true)
    public void notifyOfferEvent(User user, String title, String body) {
        NotificationPreferences prefs = preferences(user);
        if (!prefs.isPushOffersEnabled()) {
            return;
        }
        dispatch(user, title, body, Map.of("type", "offer"));
    }

    @Transactional(readOnly = true)
    public void notifyMessage(User user, String title, String body) {
        NotificationPreferences prefs = preferences(user);
        if (!prefs.isPushMessagesEnabled()) {
            return;
        }
        dispatch(user, title, body, Map.of("type", "message"));
    }

    private NotificationPreferences preferences(User user) {
        return preferencesRepository
                .findByUser(user)
                .orElseGet(
                        () -> {
                            NotificationPreferences p = new NotificationPreferences();
                            p.setUser(user);
                            return p;
                        });
    }

    private void dispatch(User user, String title, String body, Map<String, String> data) {
        List<DeviceToken> tokens = deviceTokenRepository.findByUser_Id(user.getId());
        if (tokens.isEmpty()) {
            log.debug("Push atlandı (token yok): user={} title={}", user.getEmail(), title);
            return;
        }
        if (!pushProperties.isEnabled() || pushProperties.getFcmServerKey().isBlank()) {
            log.info("[Push disabled] user={} title={}", user.getEmail(), title);
            return;
        }
        for (DeviceToken token : tokens) {
            sendFcm(token.getToken(), title, body, data);
        }
    }

    private void sendFcm(String deviceToken, String title, String body, Map<String, String> data) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "key=" + pushProperties.getFcmServerKey());

            Map<String, Object> payload = new HashMap<>();
            payload.put("to", deviceToken);
            payload.put("notification", Map.of("title", title, "body", body));
            payload.put("data", data);

            restTemplate.postForEntity(
                    "https://fcm.googleapis.com/fcm/send", new HttpEntity<>(payload, headers), String.class);
        } catch (Exception ex) {
            log.warn("FCM gönderimi başarısız: {}", ex.getMessage());
        }
    }
}
