package com.derdimet.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "animal_offers",
        uniqueConstraints =
                @UniqueConstraint(name = "uk_animal_offer_request_seller", columnNames = {"request_id", "seller_id"}))
public class AnimalOffer extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "request_id", nullable = false)
    private AnimalPurchaseRequest request;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Column(name = "price_per_kg", nullable = false)
    private BigDecimal pricePerKg;

    @Column(name = "animal_count")
    private Integer animalCount;

    @Column(name = "note")
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OfferStatus status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = OfferStatus.PENDING;
        }
    }
}
