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

/** Hayvan satıcısının favorilediği tekil alış talebi (animal_purchase_request). */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "favorite_animal_purchase_requests",
        uniqueConstraints =
                @UniqueConstraint(
                        name = "uk_favorite_animal_purchase_requests_seller_request",
                        columnNames = {"seller_id", "purchase_request_id"}))
public class FavoriteAnimalPurchaseRequest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_request_id", nullable = false)
    private AnimalPurchaseRequest purchaseRequest;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
