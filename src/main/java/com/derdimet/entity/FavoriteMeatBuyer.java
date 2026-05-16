package com.derdimet.entity;

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

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "favorite_meat_buyers",
        uniqueConstraints =
                @UniqueConstraint(
                        name = "uk_favorite_meat_buyers_slaughterhouse_buyer",
                        columnNames = {"slaughterhouse_id", "buyer_id"}))
public class FavoriteMeatBuyer extends BaseEntity {

    /** Favorileyen: kesimhane hesabı (role=SLAUGHTERHOUSE). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slaughterhouse_id", nullable = false)
    private User slaughterhouse;

    /** Favorilenen: et alıcı hesabı (role=MEAT_BUYER). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @jakarta.persistence.Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}

