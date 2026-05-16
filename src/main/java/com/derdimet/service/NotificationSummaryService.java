package com.derdimet.service;

import com.derdimet.api.NotificationSummaryResponse;
import com.derdimet.entity.OfferStatus;
import com.derdimet.entity.User;
import com.derdimet.entity.UserRole;
import com.derdimet.repository.AnimalOfferRepository;
import com.derdimet.repository.MeatOfferRepository;
import com.derdimet.repository.SlaughterhouseListingOfferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationSummaryService {

    private final MeatOfferRepository meatOfferRepository;
    private final SlaughterhouseListingOfferRepository listingOfferRepository;
    private final AnimalOfferRepository animalOfferRepository;

    @Transactional(readOnly = true)
    public NotificationSummaryResponse summarize(User user) {
        return switch (user.getRole()) {
            case MEAT_BUYER -> buyerSummary(user);
            case ANIMAL_SELLER -> sellerSummary(user);
            case SLAUGHTERHOUSE -> slaughterhouseSummary(user);
            default -> new NotificationSummaryResponse(0, 0, 0, "/role-selector");
        };
    }

    private NotificationSummaryResponse buyerSummary(User buyer) {
        long pending =
                meatOfferRepository.findByBuyerOrderByCreatedAtDesc(buyer).stream()
                        .filter(o -> o.getStatus() == OfferStatus.PENDING)
                        .count();
        int p = (int) pending;
        return new NotificationSummaryResponse(p, 0, 0, "/buyer/offers");
    }

    private NotificationSummaryResponse sellerSummary(User seller) {
        long pending =
                listingOfferRepository.findByListing_SellerOrderByCreatedAtDesc(seller).stream()
                        .filter(o -> o.getStatus() == OfferStatus.PENDING)
                        .count();
        int p = (int) pending;
        return new NotificationSummaryResponse(0, p, 0, "/seller/offers");
    }

    private NotificationSummaryResponse slaughterhouseSummary(User slaughterhouse) {
        long meatPending =
                meatOfferRepository.findBySaleRequest_SlaughterhouseOrderByCreatedAtDesc(slaughterhouse).stream()
                        .filter(o -> o.getStatus() == OfferStatus.PENDING)
                        .count();
        long purchasePending =
                animalOfferRepository
                        .findByRequest_CreatedByAndStatusOrderByCreatedAtDesc(slaughterhouse, OfferStatus.PENDING)
                        .size();
        int meat = (int) meatPending;
        int purchase = (int) purchasePending;
        int total = meat + purchase;
        String link = meat > 0 ? "/slaughterhouse/sell-meat" : "/slaughterhouse/purchase-requests";
        return new NotificationSummaryResponse(meat, 0, purchase, link);
    }
}
