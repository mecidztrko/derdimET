package com.derdimet.api;

import com.derdimet.entity.OfferEvent;
import com.derdimet.entity.OfferEventType;
import com.derdimet.entity.OfferKind;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OfferEventResponse(
        Long id,
        OfferKind offerKind,
        Long offerId,
        OfferEventType eventType,
        BigDecimal pricePerKg,
        BigDecimal quantity,
        String note,
        Integer revisionNumber,
        LocalDateTime createdAt) {

    public static OfferEventResponse fromEntity(OfferEvent e) {
        return new OfferEventResponse(
                e.getId(),
                e.getOfferKind(),
                e.getOfferId(),
                e.getEventType(),
                e.getPricePerKg(),
                e.getQuantity(),
                e.getNote(),
                e.getRevisionNumber(),
                e.getCreatedAt());
    }
}
