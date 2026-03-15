package com.derdimet.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "animal_purchase_requests")
public class AnimalPurchaseRequest extends BaseEntity {

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "animal_type")
    private String animalType;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "expected_weight")
    private BigDecimal expectedWeight;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RequestStatus status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
