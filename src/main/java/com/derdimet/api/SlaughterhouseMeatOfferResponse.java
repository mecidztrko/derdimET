package com.derdimet.api;

import com.derdimet.entity.MeatOffer;
import com.derdimet.entity.OfferStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Kesimhanenin et ilanlarına gelen alıcı teklifleri. */
public record SlaughterhouseMeatOfferResponse(
        Long offerId,
        Long saleRequestId,
        String saleRequestTitle,
        Long buyerId,
        String buyerName,
        BigDecimal pricePerKg,
        BigDecimal quantity,
        String note,
        OfferStatus status,
        LocalDateTime createdAt) {

    public static SlaughterhouseMeatOfferResponse fromEntity(MeatOffer o) {
        var r = o.getSaleRequest();
        var b = o.getBuyer();
        return new SlaughterhouseMeatOfferResponse(
                o.getId(),
                r != null ? r.getId() : null,
                r != null ? r.getTitle() : null,
                b != null ? b.getId() : null,
                b != null ? b.getName() : null,
                o.getPricePerKg(),
                o.getQuantity(),
                o.getNote(),
                o.getStatus(),
                o.getCreatedAt());
    }
}
