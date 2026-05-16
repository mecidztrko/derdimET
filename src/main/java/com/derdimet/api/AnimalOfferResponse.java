package com.derdimet.api;

import com.derdimet.entity.AnimalOffer;
import com.derdimet.entity.OfferStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AnimalOfferResponse(
        Long id, Long requestId, BigDecimal pricePerKg, Integer animalCount, String note, OfferStatus status, LocalDateTime createdAt) {

    public static AnimalOfferResponse fromEntity(AnimalOffer o) {
        return new AnimalOfferResponse(
                o.getId(),
                o.getRequest().getId(),
                o.getPricePerKg(),
                o.getAnimalCount(),
                o.getNote(),
                o.getStatus(),
                o.getCreatedAt());
    }
}
