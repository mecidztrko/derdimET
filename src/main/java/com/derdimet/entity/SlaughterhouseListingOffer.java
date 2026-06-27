package com.derdimet.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
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
        name = "slaughterhouse_listing_offers",
        uniqueConstraints =
                @UniqueConstraint(name = "uk_sh_listing_offer_listing_sh", columnNames = {"listing_id", "slaughterhouse_id"}))
public class SlaughterhouseListingOffer extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false)
    private SellerAnimalListing listing;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slaughterhouse_id", nullable = false)
    private User slaughterhouse;

    @Column(name = "price_per_kg")
    private BigDecimal pricePerKg;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "note")
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OfferStatus status;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "revision_number")
    private Integer revisionNumber;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        if (status == null) {
            status = OfferStatus.PENDING;
        }
        if (expiresAt == null) {
            expiresAt = now.plusHours(48);
        }
        if (revisionNumber == null) {
            revisionNumber = 1;
        }
    }
}

