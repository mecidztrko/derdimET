package com.derdimet.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "animals")
public class Animal extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "offer_id")
    private AnimalOffer offer;

    @Column(name = "animal_type")
    private String animalType;

    @Column(name = "weight")
    private BigDecimal weight;

    @Column(name = "arrival_date")
    private LocalDate arrivalDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private AnimalStatus status;
}
