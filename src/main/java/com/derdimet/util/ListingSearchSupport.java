package com.derdimet.util;

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
