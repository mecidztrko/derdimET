package com.derdimet.util;

import com.derdimet.entity.AnimalPurchaseRequest;
import com.derdimet.entity.ListingClosedReason;
import com.derdimet.entity.MeatSaleRequest;
import com.derdimet.entity.RequestStatus;
import com.derdimet.entity.SellerAnimalListing;
import java.time.LocalDateTime;

public final class ListingLifecycle {

    public static final int DEFAULT_LISTING_DAYS = 30;
    public static final int DEFAULT_OFFER_HOURS = 48;

    private ListingLifecycle() {}

    public static LocalDateTime defaultListingExpiresAt(LocalDateTime from) {
        return from.plusDays(DEFAULT_LISTING_DAYS);
    }

    public static LocalDateTime defaultOfferExpiresAt(LocalDateTime from) {
        return from.plusHours(DEFAULT_OFFER_HOURS);
    }

    public static void close(MeatSaleRequest listing, ListingClosedReason reason) {
        listing.setStatus(RequestStatus.CLOSED);
        listing.setClosedReason(reason);
        listing.setClosedAt(LocalDateTime.now());
    }

    public static void close(SellerAnimalListing listing, ListingClosedReason reason) {
        listing.setStatus(RequestStatus.CLOSED);
        listing.setClosedReason(reason);
        listing.setClosedAt(LocalDateTime.now());
    }

    public static void close(AnimalPurchaseRequest listing, ListingClosedReason reason) {
        listing.setStatus(RequestStatus.CLOSED);
        listing.setClosedReason(reason);
        listing.setClosedAt(LocalDateTime.now());
    }
}
