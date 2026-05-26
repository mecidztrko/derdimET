package com.derdimet.service;

import com.derdimet.api.NotificationSummaryResponse;
import com.derdimet.entity.OfferStatus;
import com.derdimet.entity.User;
import com.derdimet.entity.UserRole;
import com.derdimet.repository.AnimalOfferRepository;
import com.derdimet.repository.MeatOfferRepository;
import com.derdimet.repository.MessageRepository;
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
    private final MessageRepository messageRepository;

    @Transactional(readOnly = true)
    public NotificationSummaryResponse summarize(User user) {
        return switch (user.getRole()) {
            case MEAT_BUYER -> buyerSummary(user);
            case ANIMAL_SELLER -> sellerSummary(user);
            case SLAUGHTERHOUSE -> slaughterhouseSummary(user);
            default -> new NotificationSummaryResponse(0, 0, 0, 0, "/role-selector");
        };
    }

    private NotificationSummaryResponse buyerSummary(User buyer) {
        long pending =
                meatOfferRepository.findByBuyerOrderByCreatedAtDesc(buyer).stream()
                        .filter(o -> o.getStatus() == OfferStatus.PENDING)
                        .count();
        int p = (int) pending;
        int unread = (int) messageRepository.countUnreadForUser(buyer.getId());
        String link = unread > 0 ? "/buyer/messages" : p > 0 ? "/buyer/offers" : "/buyer";
        return new NotificationSummaryResponse(p, 0, 0, unread, link);
    }

    private NotificationSummaryResponse sellerSummary(User seller) {
        long pending =
                listingOfferRepository.findByListing_SellerOrderByCreatedAtDesc(seller).stream()
                        .filter(o -> o.getStatus() == OfferStatus.PENDING)
                        .count();
        int p = (int) pending;
        int unread = (int) messageRepository.countUnreadForUser(seller.getId());
        String link = unread > 0 ? "/seller/messages" : p > 0 ? "/seller/offers" : "/seller";
        return new NotificationSummaryResponse(0, p, 0, unread, link);
    }

    private NotificationSummaryResponse slaughterhouseSummary(User slaughterhouse) {
        long meatPending =
                meatOfferRepository.findBySaleRequest_SlaughterhouseOrderByCreatedAtDesc(slaughterhouse).stream()
                        .filter(o -> o.getStatus() == OfferStatus.PENDING)
                        .count();
        long animalListingPending =
                listingOfferRepository
                        .findBySlaughterhouseAndStatusOrderByCreatedAtDesc(slaughterhouse, OfferStatus.PENDING)
                        .size();
        long purchasePending =
                animalOfferRepository
                        .findByRequest_CreatedByAndStatusOrderByCreatedAtDesc(slaughterhouse, OfferStatus.PENDING)
                        .size();
        int meat = (int) meatPending;
        int animalListing = (int) animalListingPending;
        int purchase = (int) purchasePending;
        int unread = (int) messageRepository.countUnreadForUser(slaughterhouse.getId());
        String link =
                unread > 0
                        ? "/slaughterhouse/messages"
                        : meat > 0
                                ? "/slaughterhouse/sell-meat"
                                : purchase > 0
                                        ? "/slaughterhouse/purchase-requests"
                                        : animalListing > 0 ? "/slaughterhouse/offers" : "/slaughterhouse";
        return new NotificationSummaryResponse(meat, animalListing, purchase, unread, link);
    }
}
