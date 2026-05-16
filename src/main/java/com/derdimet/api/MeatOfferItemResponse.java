package com.derdimet.api;

import com.derdimet.entity.MeatOffer;
import com.derdimet.entity.OfferStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MeatOfferItemResponse(
        Long offerId,
        Long saleRequestId,
        String title,
        String meatType,
        BigDecimal requestedQuantity,
        Long slaughterhouseId,
        String slaughterhouseName,
        BigDecimal pricePerKg,
        BigDecimal quantity,
        String note,
        OfferStatus status,
        LocalDateTime createdAt) {

    public static MeatOfferItemResponse fromEntity(MeatOffer o) {
        var r = o.getSaleRequest();
        var s = r != null ? r.getSlaughterhouse() : null;
        return new MeatOfferItemResponse(
                o.getId(),
                r != null ? r.getId() : null,
                r != null ? r.getTitle() : null,
                r != null ? r.getMeatType() : null,
                r != null ? r.getQuantity() : null,
                s != null ? s.getId() : null,
                s != null ? s.getName() : null,
                o.getPricePerKg(),
                o.getQuantity(),
                o.getNote(),
                o.getStatus(),
                o.getCreatedAt());
    }
}

