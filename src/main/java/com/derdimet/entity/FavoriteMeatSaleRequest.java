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

/** Et alıcısının favorilediği tekil et ilanı (meat_sale_request). */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "favorite_meat_sale_requests",
        uniqueConstraints =
                @UniqueConstraint(
                        name = "uk_favorite_meat_sale_requests_buyer_listing",
                        columnNames = {"buyer_id", "sale_request_id"}))
public class FavoriteMeatSaleRequest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_request_id", nullable = false)
    private MeatSaleRequest saleRequest;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
