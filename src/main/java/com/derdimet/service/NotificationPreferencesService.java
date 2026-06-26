package com.derdimet.service;

import com.derdimet.api.NotificationPreferencesResponse;
import com.derdimet.api.RegisterDeviceTokenRequest;
import com.derdimet.api.UpdateNotificationPreferencesRequest;
import com.derdimet.entity.DeviceToken;
import com.derdimet.entity.NotificationPreferences;
import com.derdimet.entity.User;
import com.derdimet.repository.DeviceTokenRepository;
import com.derdimet.repository.NotificationPreferencesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationPreferencesService {

    private final NotificationPreferencesRepository preferencesRepository;
    private final DeviceTokenRepository deviceTokenRepository;

    @Transactional(readOnly = true)
    public NotificationPreferencesResponse get(User user) {
        return toResponse(requirePreferences(user));
    }

    @Transactional
    public NotificationPreferencesResponse update(User user, UpdateNotificationPreferencesRequest body) {
        NotificationPreferences prefs = requirePreferences(user);
        if (body.pushOffersEnabled() != null) {
            prefs.setPushOffersEnabled(body.pushOffersEnabled());
        }
        if (body.pushMessagesEnabled() != null) {
            prefs.setPushMessagesEnabled(body.pushMessagesEnabled());
        }
        if (body.pushMarketingEnabled() != null) {
            prefs.setPushMarketingEnabled(body.pushMarketingEnabled());
        }
        return toResponse(preferencesRepository.save(prefs));
    }

    @Transactional
    public void registerDeviceToken(User user, RegisterDeviceTokenRequest body) {
        deviceTokenRepository
                .findByUser_IdAndToken(user.getId(), body.token())
                .orElseGet(
                        () -> {
                            DeviceToken token = new DeviceToken();
                            token.setUser(user);
                            token.setToken(body.token());
                            token.setPlatform(body.platform());
                            return deviceTokenRepository.save(token);
                        });
    }

    @Transactional
    public void removeDeviceToken(User user, String token) {
        deviceTokenRepository.findByUser_IdAndToken(user.getId(), token).ifPresent(deviceTokenRepository::delete);
    }

    private NotificationPreferences requirePreferences(User user) {
        return preferencesRepository
                .findByUser(user)
                .orElseGet(
                        () -> {
                            NotificationPreferences prefs = new NotificationPreferences();
                            prefs.setUser(user);
                            return preferencesRepository.save(prefs);
                        });
    }

    private static NotificationPreferencesResponse toResponse(NotificationPreferences prefs) {
        return new NotificationPreferencesResponse(
                prefs.isPushOffersEnabled(),
                prefs.isPushMessagesEnabled(),
                !Boolean.FALSE.equals(prefs.getPushMarketingEnabled()));
    }
}
