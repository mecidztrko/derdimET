package com.derdimet.api;

import com.derdimet.entity.OfferStatus;
import com.derdimet.entity.SlaughterhouseListingOffer;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ListingOfferResponse(
        Long offerId,
        Long listingId,
        String listingType,
        String listingCategory,
        Long sellerId,
        String sellerName,
        Long slaughterhouseId,
        String slaughterhouseName,
        BigDecimal pricePerKg,
        Integer quantity,
        String note,
        OfferStatus status,
        Integer revisionNumber,
        LocalDateTime expiresAt,
        LocalDateTime createdAt) {

    public static ListingOfferResponse fromEntity(SlaughterhouseListingOffer o) {
        var l = o.getListing();
        var seller = l != null ? l.getSeller() : null;
        var sh = o.getSlaughterhouse();
        return new ListingOfferResponse(
                o.getId(),
                l != null ? l.getId() : null,
                l != null ? l.getType() : null,
                l != null && l.getCategory() != null ? l.getCategory().name() : null,
                seller != null ? seller.getId() : null,
                seller != null ? seller.getName() : null,
                sh != null ? sh.getId() : null,
                sh != null ? sh.getName() : null,
                o.getPricePerKg(),
                o.getQuantity(),
                o.getNote(),
                o.getStatus(),
                o.getRevisionNumber(),
                o.getExpiresAt(),
                o.getCreatedAt());
    }
}

