package com.derdimet.api;

import com.derdimet.entity.AnimalOffer;
import com.derdimet.entity.OfferStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PurchaseRequestIncomingOfferResponse(
        Long offerId,
        Long requestId,
        Long sellerId,
        String sellerName,
        String sellerCompanyName,
        BigDecimal pricePerKg,
        Integer animalCount,
        String note,
        OfferStatus status,
        LocalDateTime createdAt) {

    public static PurchaseRequestIncomingOfferResponse fromEntity(AnimalOffer o) {
        var s = o.getSeller();
        var r = o.getRequest();
        return new PurchaseRequestIncomingOfferResponse(
                o.getId(),
                r != null ? r.getId() : null,
                s != null ? s.getId() : null,
                s != null ? s.getName() : null,
                s != null ? s.getCompanyName() : null,
                o.getPricePerKg(),
                o.getAnimalCount(),
                o.getNote(),
                o.getStatus(),
                o.getCreatedAt());
    }
}
