package com.derdimet.api;

import com.derdimet.entity.AnimalDeal;
import com.derdimet.entity.AnimalDealType;
import com.derdimet.entity.AnimalOffer;
import com.derdimet.entity.OfferStatus;
import com.derdimet.entity.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SellerSaleItemResponse(
        Long offerId,
        String saleType,
        Long requestId,
        String requestTitle,
        Long listingId,
        String listingTitle,
        Long slaughterhouseId,
        String slaughterhouseName,
        String slaughterhouseCompanyName,
        BigDecimal pricePerKg,
        Integer animalCount,
        BigDecimal estimatedTotal,
        OfferStatus status,
        LocalDateTime createdAt) {

    public static SellerSaleItemResponse fromPurchaseRequestOffer(AnimalOffer o) {
        var r = o.getRequest();
        var sh = r != null ? r.getCreatedBy() : null;
        BigDecimal price = o.getPricePerKg();
        Integer count = o.getAnimalCount();
        BigDecimal total = null;
        if (price != null && count != null && count > 0) {
            total = price.multiply(BigDecimal.valueOf(count));
        }
        return new SellerSaleItemResponse(
                o.getId(),
                "PURCHASE_REQUEST",
                r != null ? r.getId() : null,
                r != null ? r.getTitle() : null,
                null,
                null,
                sh != null ? sh.getId() : null,
                sh != null ? sh.getName() : null,
                sh != null ? sh.getCompanyName() : null,
                price,
                count,
                total,
                o.getStatus(),
                o.getCreatedAt());
    }

    public static SellerSaleItemResponse fromListingOffer(com.derdimet.entity.SlaughterhouseListingOffer o) {
        var l = o.getListing();
        var sh = o.getSlaughterhouse();
        BigDecimal price = o.getPricePerKg();
        Integer qty = o.getQuantity();
        BigDecimal total = null;
        if (price != null && qty != null && qty > 0) {
            total = price.multiply(BigDecimal.valueOf(qty));
        }
        String listingTitle = listingTitle(l);
        return new SellerSaleItemResponse(
                o.getId(),
                "DIRECT_LISTING",
                null,
                null,
                l != null ? l.getId() : null,
                listingTitle,
                sh != null ? sh.getId() : null,
                sh != null ? sh.getName() : null,
                sh != null ? sh.getCompanyName() : null,
                price,
                qty,
                total,
                o.getStatus(),
                o.getCreatedAt());
    }

    public static SellerSaleItemResponse fromAnimalDeal(AnimalDeal d) {
        if (d.getDealType() == AnimalDealType.PURCHASE_REQUEST && d.getAnimalOffer() != null) {
            var o = d.getAnimalOffer();
            var r = o.getRequest();
            var sh = d.getSlaughterhouse();
            return new SellerSaleItemResponse(
                    o.getId(),
                    "PURCHASE_REQUEST",
                    r != null ? r.getId() : null,
                    r != null ? r.getTitle() : null,
                    null,
                    null,
                    sh != null ? sh.getId() : null,
                    sh != null ? sh.getName() : null,
                    sh != null ? sh.getCompanyName() : null,
                    d.getPricePerKg(),
                    d.getQuantity(),
                    d.getTotalPrice(),
                    toOfferStatus(d.getStatus()),
                    d.getCreatedAt());
        }
        if (d.getDealType() == AnimalDealType.DIRECT_LISTING && d.getListingOffer() != null) {
            var o = d.getListingOffer();
            var l = o.getListing();
            var sh = d.getSlaughterhouse();
            return new SellerSaleItemResponse(
                    o.getId(),
                    "DIRECT_LISTING",
                    null,
                    null,
                    l != null ? l.getId() : null,
                    listingTitle(l),
                    sh != null ? sh.getId() : null,
                    sh != null ? sh.getName() : null,
                    sh != null ? sh.getCompanyName() : null,
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
