package com.derdimet.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "offer_events")
public class OfferEvent extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "offer_kind", length = 16, nullable = false)
    private OfferKind offerKind;

    @Column(name = "offer_id", nullable = false)
    private Long offerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", length = 16, nullable = false)
    private OfferEventType eventType;

    @Column(name = "price_per_kg")
    private BigDecimal pricePerKg;

    @Column(name = "quantity")
    private BigDecimal quantity;

    @Column(name = "note", length = 512)
    private String note;

    @Column(name = "revision_number")
    private Integer revisionNumber;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
