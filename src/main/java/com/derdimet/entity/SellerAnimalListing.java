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
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "seller_animal_listings")
public class SellerAnimalListing extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", length = 32, nullable = false)
    private AnimalCategory category;

    @Column(name = "type", length = 128, nullable = false)
    private String type;

    @Column(name = "breed", length = 128)
    private String breed;

    @Column(name = "age_months")
    private Integer ageMonths;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "avg_weight_kg")
    private BigDecimal avgWeightKg;

    /** Satıcının istediği toplam fiyat veya referans fiyat. */
    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "location", length = 256)
    private String location;

    @Column(name = "description", length = 2000)
    private String description;

    /** Görsel URL'leri virgülle ayrılmış olarak saklanır (geriye dönük uyum). */
    @Column(name = "image_urls", length = 4000)
    private String imageUrls;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RequestStatus status;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "closed_reason", length = 32)
    private ListingClosedReason closedReason;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        if (status == null) {
            status = RequestStatus.OPEN;
        }
        if (expiresAt == null) {
            expiresAt = now.plusDays(30);
        }
    }
}

