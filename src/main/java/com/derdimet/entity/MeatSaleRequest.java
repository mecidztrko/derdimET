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
@Table(name = "meat_sale_requests")
public class MeatSaleRequest extends BaseEntity {

    @Column(name = "title")
    private String title;

    @Column(name = "meat_type")
    private String meatType;

    @Column(name = "quantity")
    private BigDecimal quantity;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RequestStatus status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
