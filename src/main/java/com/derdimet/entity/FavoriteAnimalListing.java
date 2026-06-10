package com.derdimet.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Kesimhanenin favorilediği tekil hayvan satış ilanı (seller_animal_listing). */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "favorite_animal_listings",
        uniqueConstraints =
                @UniqueConstraint(
                        name = "uk_favorite_animal_listings_slaughterhouse_listing",
                        columnNames = {"slaughterhouse_id", "listing_id"}))
public class FavoriteAnimalListing extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slaughterhouse_id", nullable = false)
    private User slaughterhouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false)
    private SellerAnimalListing listing;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
