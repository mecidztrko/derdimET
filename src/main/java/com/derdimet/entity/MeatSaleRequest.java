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
@Table(name = "meat_sale_requests")
public class MeatSaleRequest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slaughterhouse_id")
    private User slaughterhouse;

    @Column(name = "title")
    private String title;

    @Column(name = "meat_type")
    private String meatType;

    /** Kaynak hayvan türü (büyükbaş/küçükbaş) bilgisi. */
    @Enumerated(EnumType.STRING)
    @Column(name = "animal_category", length = 32)
    private AnimalCategory animalCategory;

    /** Etin hayvanın hangi kısmı olduğu (örn. but, kuşbaşı). */
    @Column(name = "cut", length = 128)
    private String cut;

    @Column(name = "quantity")
    private BigDecimal quantity;

    /** Kg başı fiyat (opsiyonel). */
    @Column(name = "price_per_kg")
    private BigDecimal pricePerKg;

    /** Paketleme bilgisi (örn. vakumlu, parça vb.). */
    @Column(name = "packaging", length = 128)
    private String packaging;

    @Column(name = "location", length = 256)
    private String location;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "image_urls", length = 4000)
    private String imageUrls;

    @Column(name = "stock_id")
    private Long stockId;

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
