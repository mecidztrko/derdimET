package com.derdimet.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "notification_preferences")
public class NotificationPreferences extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "push_offers_enabled")
    private Boolean pushOffersEnabled = true;

    @Column(name = "push_messages_enabled")
    private Boolean pushMessagesEnabled = true;

    @Column(name = "push_marketing_enabled")
    private Boolean pushMarketingEnabled = false;

    public boolean isPushOffersEnabled() {
        return !Boolean.FALSE.equals(pushOffersEnabled);
    }

    public boolean isPushMessagesEnabled() {
        return !Boolean.FALSE.equals(pushMessagesEnabled);
    }
}
