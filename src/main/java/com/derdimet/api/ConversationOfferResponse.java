package com.derdimet.api;

import com.derdimet.entity.AnimalOffer;
import com.derdimet.entity.MeatOffer;
import com.derdimet.entity.OfferStatus;
import com.derdimet.entity.SlaughterhouseListingOffer;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/** İki kullanıcı arasındaki teklif — mesajlaşma ekranında gösterilir. */
public record ConversationOfferResponse(
        String kind,
        Long offerId,
        String title,
        String subtitle,
        BigDecimal pricePerKg,
        Integer animalCount,
        BigDecimal quantityKg,
        String note,
        OfferStatus status,
        LocalDateTime createdAt,
        boolean incoming) {

    public static final String KIND_LISTING = "LISTING";
    public static final String KIND_ANIMAL = "ANIMAL";
    public static final String KIND_MEAT = "MEAT";

    public static ConversationOfferResponse fromListing(SlaughterhouseListingOffer o, Long currentUserId) {
        var listing = o.getListing();
        var seller = listing != null ? listing.getSeller() : null;
        var sh = o.getSlaughterhouse();
        boolean incoming = seller != null && seller.getId() != null && seller.getId().equals(currentUserId);
        String type = listing != null ? listing.getType() : null;
        String category = listing != null && listing.getCategory() != null ? listing.getCategory().name() : null;
        String subtitle =
                (type != null ? type : "İlan")
                        + (category != null ? " · " + category : "")
                        + (incoming ? " · Gelen teklif" : " · Verdiğiniz teklif");
        return new ConversationOfferResponse(
                KIND_LISTING,
                o.getId(),
                incoming
                        ? (sh != null ? sh.getName() : "Kesimhane")
                        : (listing != null && seller != null ? "İlan teklifiniz" : "İlan teklifi"),
                subtitle,
                o.getPricePerKg(),
                o.getQuantity(),
                null,
                o.getNote(),
                o.getStatus(),
                o.getCreatedAt(),
                incoming);
    }

    public static ConversationOfferResponse fromAnimal(AnimalOffer o, Long currentUserId) {
        var req = o.getRequest();
        var sh = req != null ? req.getCreatedBy() : null;
        var seller = o.getSeller();
        boolean incoming =
                sh != null && sh.getId() != null && sh.getId().equals(currentUserId);
        return new ConversationOfferResponse(
                KIND_ANIMAL,
                o.getId(),
                req != null ? req.getTitle() : "Alış talebi",
                incoming
                        ? (seller != null ? seller.getName() : "Satıcı") + " · Gelen teklif"
                        : (sh != null ? sh.getName() : "Kesimhane") + " · Verdiğiniz teklif",
                o.getPricePerKg(),
                o.getAnimalCount(),
                null,
                o.getNote(),
                o.getStatus(),
                o.getCreatedAt(),
                incoming);
    }

    public static ConversationOfferResponse fromMeat(MeatOffer o, Long currentUserId) {
        var sale = o.getSaleRequest();
        var sh = sale != null ? sale.getSlaughterhouse() : null;
        var buyer = o.getBuyer();
        boolean incoming =
                sh != null && sh.getId() != null && sh.getId().equals(currentUserId);
        return new ConversationOfferResponse(
                KIND_MEAT,
                o.getId(),
                sale != null ? sale.getTitle() : "Et ilanı",
                incoming
                        ? (buyer != null ? buyer.getName() : "Alıcı") + " · Gelen teklif"
                        : (sh != null ? sh.getName() : "Kesimhane") + " · Verdiğiniz teklif",
                o.getPricePerKg(),
                null,
                o.getQuantity(),
                o.getNote(),
                o.getStatus(),
                o.getCreatedAt(),
                incoming);
    }
}
