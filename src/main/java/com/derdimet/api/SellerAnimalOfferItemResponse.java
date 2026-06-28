package com.derdimet.api;

import com.derdimet.entity.AnimalOffer;
import com.derdimet.entity.OfferStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SellerAnimalOfferItemResponse(
        Long offerId,
        AnimalPurchaseRequestResponse request,
        BigDecimal pricePerKg,
        Integer animalCount,
        String note,
        OfferStatus status,
        Integer revisionNumber,
        LocalDateTime expiresAt,
        LocalDateTime createdAt) {

    public static SellerAnimalOfferItemResponse fromEntity(AnimalOffer o) {
        return new SellerAnimalOfferItemResponse(
                o.getId(),
                AnimalPurchaseRequestResponse.fromEntity(o.getRequest()),
                o.getPricePerKg(),
                o.getAnimalCount(),
                o.getNote(),
                o.getStatus(),
                o.getRevisionNumber(),
                o.getExpiresAt(),
                o.getCreatedAt());
    }
}
