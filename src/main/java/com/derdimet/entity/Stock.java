package com.derdimet.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "stock")
public class Stock extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "meat_product_id", nullable = false)
    private MeatProduct meatProduct;

    @Column(name = "quantity")
    private BigDecimal quantity;

    @Column(name = "last_update")
    private LocalDateTime lastUpdate;
}
