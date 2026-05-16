package com.derdimet.api;

import com.derdimet.entity.AnimalDeal;
import com.derdimet.entity.AnimalDealType;
import com.derdimet.entity.AnimalOffer;
import com.derdimet.entity.OfferStatus;
import com.derdimet.entity.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SlaughterhousePurchaseItemResponse(
        Long offerId,
        String purchaseType,
        Long requestId,
        String requestTitle,
        Long listingId,
        String listingTitle,
        Long sellerId,
        String sellerName,
        String sellerCompanyName,
        BigDecimal pricePerKg,
        Integer animalCount,
        BigDecimal estimatedTotal,
        OfferStatus status,
        LocalDateTime createdAt) {

    public static SlaughterhousePurchaseItemResponse fromPurchaseRequestOffer(AnimalOffer o) {
        var r = o.getRequest();
        var s = o.getSeller();
        BigDecimal price = o.getPricePerKg();
        Integer count = o.getAnimalCount();
        BigDecimal total = null;
        if (price != null && count != null && count > 0) {
            total = price.multiply(BigDecimal.valueOf(count));
        }
        return new SlaughterhousePurchaseItemResponse(
                o.getId(),
                "PURCHASE_REQUEST",
                r != null ? r.getId() : null,
                r != null ? r.getTitle() : null,
                null,
                null,
                s != null ? s.getId() : null,
                s != null ? s.getName() : null,
                s != null ? s.getCompanyName() : null,
                price,
                count,
                total,
                o.getStatus(),
                o.getCreatedAt());
    }

    public static SlaughterhousePurchaseItemResponse fromListingOffer(com.derdimet.entity.SlaughterhouseListingOffer o) {
        var l = o.getListing();
        var s = l != null ? l.getSeller() : null;
        BigDecimal price = o.getPricePerKg();
        Integer qty = o.getQuantity();
        BigDecimal total = null;
        if (price != null && qty != null && qty > 0) {
            total = price.multiply(BigDecimal.valueOf(qty));
        }
        String listingTitle = listingTitle(l);
        return new SlaughterhousePurchaseItemResponse(
                o.getId(),
                "DIRECT_LISTING",
                null,
                null,
                l != null ? l.getId() : null,
                listingTitle,
                s != null ? s.getId() : null,
                s != null ? s.getName() : null,
                s != null ? s.getCompanyName() : null,
                price,
                qty,
                total,
                o.getStatus(),
                o.getCreatedAt());
    }

    public static SlaughterhousePurchaseItemResponse fromAnimalDeal(AnimalDeal d) {
        if (d.getDealType() == AnimalDealType.PURCHASE_REQUEST && d.getAnimalOffer() != null) {
            var o = d.getAnimalOffer();
            var r = o.getRequest();
            var s = d.getSeller();
            return new SlaughterhousePurchaseItemResponse(
                    o.getId(),
                    "PURCHASE_REQUEST",
                    r != null ? r.getId() : null,
                    r != null ? r.getTitle() : null,
                    null,
                    null,
                    s != null ? s.getId() : null,
                    s != null ? s.getName() : null,
                    s != null ? s.getCompanyName() : null,
                    d.getPricePerKg(),
                    d.getQuantity(),
                    d.getTotalPrice(),
                    toOfferStatus(d.getStatus()),
                    d.getCreatedAt());
        }
        if (d.getDealType() == AnimalDealType.DIRECT_LISTING && d.getListingOffer() != null) {
            var o = d.getListingOffer();
            var l = o.getListing();
            var s = d.getSeller();
            return new SlaughterhousePurchaseItemResponse(
                    o.getId(),
                    "DIRECT_LISTING",
                    null,
                    null,
                    l != null ? l.getId() : null,
                    listingTitle(l),
                    s != null ? s.getId() : null,
                    s != null ? s.getName() : null,
                    s != null ? s.getCompanyName() : null,
                    d.getPricePerKg(),
                    d.getQuantity(),
                    d.getTotalPrice(),
                    toOfferStatus(d.getStatus()),
                    d.getCreatedAt());
        }
        return null;
    }

    private static OfferStatus toOfferStatus(OrderStatus status) {
        return status == OrderStatus.COMPLETED ? OfferStatus.ACCEPTED : OfferStatus.PENDING;
    }

    private static String listingTitle(com.derdimet.entity.SellerAnimalListing l) {
        if (l == null) return null;
        String type = l.getType();
        String breed = l.getBreed();
        if (type != null && breed != null) return type + " · " + breed;
        if (type != null) return type;
        if (breed != null) return breed;
        return "Hayvan ilanı";
    }
}

