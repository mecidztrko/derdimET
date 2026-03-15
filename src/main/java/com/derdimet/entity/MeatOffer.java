package com.derdimet.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "meat_offers")
public class MeatOffer extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "sale_request_id", nullable = false)
    private MeatSaleRequest saleRequest;

    @ManyToOne
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @Column(name = "price_per_kg")
    private BigDecimal pricePerKg;

    @Column(name = "quantity")
    private BigDecimal quantity;

    @Column(name = "note")
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OfferStatus status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
