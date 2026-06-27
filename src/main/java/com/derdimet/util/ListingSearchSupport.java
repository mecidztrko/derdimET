package com.derdimet.util;

import com.derdimet.entity.AnimalCategory;
import com.derdimet.entity.MeatOffer;
import com.derdimet.entity.MeatSaleRequest;
import com.derdimet.entity.SellerAnimalListing;
import com.derdimet.entity.User;

/** İlan listelerinde serbest metin araması (q parametresi). */
public final class ListingSearchSupport {

    private ListingSearchSupport() {}

    public static boolean matchesAnimalListing(SellerAnimalListing listing, String q) {
        if (q == null || q.isBlank()) {
            return true;
        }
        String needle = q.trim().toLowerCase();
        User seller = listing.getSeller();
        String hay =
                join(
                        listing.getType(),
                        listing.getBreed(),
                        listing.getLocation(),
                        listing.getDescription(),
                        seller != null ? seller.getName() : null,
                        seller != null ? seller.getCompanyName() : null,
                        seller != null ? seller.getCity() : null);
        return hay.contains(needle);
    }

    public static boolean matchesMeatOffer(MeatOffer offer, String q) {
        if (q == null || q.isBlank()) {
            return true;
        }
        String needle = q.trim().toLowerCase();
        MeatSaleRequest sale = offer.getSaleRequest();
        User sh = sale != null ? sale.getSlaughterhouse() : null;
        String hay =
                join(
                        sale != null ? sale.getTitle() : null,
                        sale != null ? sale.getMeatType() : null,
                        offer.getNote(),
                        sh != null ? sh.getName() : null,
                        sh != null ? sh.getCompanyName() : null);
        return hay.contains(needle);
    }

    public static boolean matchesMeatSale(MeatSaleRequest sale, String q) {
        if (q == null || q.isBlank()) {
            return true;
        }
        String needle = q.trim().toLowerCase();
        User sh = sale.getSlaughterhouse();
        String hay =
                join(
                        sale.getTitle(),
                        sale.getMeatType(),
                        sale.getCut(),
                        sale.getLocation(),
                        sale.getDescription(),
                        sale.getPackaging(),
                        sh != null ? sh.getName() : null,
                        sh != null ? sh.getCompanyName() : null,
                        sh != null ? sh.getCity() : null);
        return hay.contains(needle);
    }

    public static boolean matchesMeatSaleFilters(
            MeatSaleRequest sale,
            String city,
            java.math.BigDecimal priceMin,
            java.math.BigDecimal priceMax,
            AnimalCategory animalCategory,
            java.time.LocalDateTime createdAfter) {
        if (city != null && !city.isBlank()) {
            User sh = sale.getSlaughterhouse();
            String cityNeedle = city.trim().toLowerCase();
            String listingCity = sale.getLocation() != null ? sale.getLocation().toLowerCase() : "";
            String profileCity = sh != null && sh.getCity() != null ? sh.getCity().toLowerCase() : "";
            if (!listingCity.contains(cityNeedle) && !profileCity.contains(cityNeedle)) {
                return false;
            }
        }
        if (priceMin != null && sale.getPricePerKg() != null && sale.getPricePerKg().compareTo(priceMin) < 0) {
            return false;
        }
        if (priceMax != null && sale.getPricePerKg() != null && sale.getPricePerKg().compareTo(priceMax) > 0) {
            return false;
        }
        if (animalCategory != null && sale.getAnimalCategory() != animalCategory) {
            return false;
        }
        if (createdAfter != null && sale.getCreatedAt() != null && sale.getCreatedAt().isBefore(createdAfter)) {
            return false;
        }
        return true;
    }

    private static String join(String... parts) {
        StringBuilder sb = new StringBuilder();
        for (String p : parts) {
            if (p != null && !p.isBlank()) {
                if (sb.length() > 0) {
                    sb.append(' ');
                }
                sb.append(p.trim());
            }
        }
        return sb.toString().toLowerCase();
    }
}
