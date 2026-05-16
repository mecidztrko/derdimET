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
        name = "animal_deals",
        uniqueConstraints = {
            @UniqueConstraint(name = "uk_animal_deal_animal_offer", columnNames = {"animal_offer_id"}),
            @UniqueConstraint(name = "uk_animal_deal_listing_offer", columnNames = {"listing_offer_id"})
        })
public class AnimalDeal extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "deal_type", nullable = false)
    private AnimalDealType dealType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "animal_offer_id")
    private AnimalOffer animalOffer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_offer_id")
    private SlaughterhouseListingOffer listingOffer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slaughterhouse_id", nullable = false)
    private User slaughterhouse;

    @Column(name = "price_per_kg")
    private BigDecimal pricePerKg;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OrderStatus status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = OrderStatus.COMPLETED;
        }
    }
}
