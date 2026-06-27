package com.derdimet.service;

import com.derdimet.entity.AnimalOffer;
import com.derdimet.entity.AnimalPurchaseRequest;
import com.derdimet.entity.ListingClosedReason;
import com.derdimet.entity.MeatOffer;
import com.derdimet.entity.MeatSaleRequest;
import com.derdimet.entity.NotificationType;
import com.derdimet.entity.OfferEventType;
import com.derdimet.entity.OfferKind;
import com.derdimet.entity.OfferStatus;
import com.derdimet.entity.RequestStatus;
import com.derdimet.entity.SellerAnimalListing;
import com.derdimet.entity.SlaughterhouseListingOffer;
import com.derdimet.repository.AnimalOfferRepository;
import com.derdimet.repository.AnimalPurchaseRequestRepository;
import com.derdimet.repository.MeatOfferRepository;
import com.derdimet.repository.MeatSaleRequestRepository;
import com.derdimet.repository.SellerAnimalListingRepository;
import com.derdimet.repository.SlaughterhouseListingOfferRepository;
import com.derdimet.util.ListingLifecycle;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MarketMaintenanceScheduler {

    private final MeatSaleRequestRepository meatSaleRequestRepository;
    private final SellerAnimalListingRepository sellerAnimalListingRepository;
    private final AnimalPurchaseRequestRepository animalPurchaseRequestRepository;
    private final MeatOfferRepository meatOfferRepository;
    private final SlaughterhouseListingOfferRepository listingOfferRepository;
    private final AnimalOfferRepository animalOfferRepository;
    private final InboxNotificationService inboxNotificationService;
    private final OfferEventService offerEventService;

    @Scheduled(fixedRate = 3_600_000)
    @Transactional
    public void expireListingsAndOffers() {
        LocalDateTime now = LocalDateTime.now();
        expireMeatListings(now);
        expireAnimalListings(now);
        expirePurchaseRequests(now);
        expireMeatOffers(now);
        expireListingOffers(now);
        expireAnimalOffers(now);
    }

    private void expireMeatListings(LocalDateTime now) {
        List<MeatSaleRequest> expired =
                meatSaleRequestRepository.findByStatusAndExpiresAtBefore(RequestStatus.OPEN, now);
        for (MeatSaleRequest listing : expired) {
            ListingLifecycle.close(listing, ListingClosedReason.EXPIRED);
            meatSaleRequestRepository.save(listing);
            if (listing.getSlaughterhouse() != null) {
                inboxNotificationService.create(
                        listing.getSlaughterhouse(),
                        NotificationType.LISTING,
                        "İlan süresi doldu",
                        "\"" + listing.getTitle() + "\" ilanı otomatik kapatıldı.",
                        "/slaughterhouse/sell-meat");
            }
        }
        if (!expired.isEmpty()) {
            log.info("Süresi dolan et ilanı: {}", expired.size());
        }
    }

    private void expireAnimalListings(LocalDateTime now) {
        List<SellerAnimalListing> expired =
                sellerAnimalListingRepository.findByStatusAndExpiresAtBefore(RequestStatus.OPEN, now);
        for (SellerAnimalListing listing : expired) {
            ListingLifecycle.close(listing, ListingClosedReason.EXPIRED);
            sellerAnimalListingRepository.save(listing);
            if (listing.getSeller() != null) {
                inboxNotificationService.create(
                        listing.getSeller(),
                        NotificationType.LISTING,
                        "İlan süresi doldu",
                        "Hayvan ilanınız otomatik kapatıldı.",
                        "/seller/listings");
            }
        }
    }

    private void expirePurchaseRequests(LocalDateTime now) {
        List<AnimalPurchaseRequest> expired =
                animalPurchaseRequestRepository.findByStatusAndExpiresAtBefore(RequestStatus.OPEN, now);
        for (AnimalPurchaseRequest listing : expired) {
            ListingLifecycle.close(listing, ListingClosedReason.EXPIRED);
            animalPurchaseRequestRepository.save(listing);
            if (listing.getCreatedBy() != null) {
                inboxNotificationService.create(
                        listing.getCreatedBy(),
                        NotificationType.LISTING,
                        "Alış talebi süresi doldu",
                        "\"" + listing.getTitle() + "\" talebi otomatik kapatıldı.",
                        "/slaughterhouse/purchase-requests");
            }
        }
    }

    private void expireMeatOffers(LocalDateTime now) {
        List<MeatOffer> expired = meatOfferRepository.findByStatusAndExpiresAtBefore(OfferStatus.PENDING, now);
        for (MeatOffer offer : expired) {
            offer.setStatus(OfferStatus.REJECTED);
            offer.setNote("Süre doldu (48 saat)");
            meatOfferRepository.save(offer);
            offerEventService.record(
                    OfferKind.MEAT,
                    offer.getId(),
                    OfferEventType.EXPIRED,
                    offer.getPricePerKg(),
                    offer.getQuantity(),
                    offer.getNote(),
                    offer.getRevisionNumber());
            if (offer.getBuyer() != null) {
                inboxNotificationService.create(
                        offer.getBuyer(),
                        NotificationType.OFFER,
                        "Teklif süresi doldu",
                        "Et teklifinizin yanıt süresi doldu.",
                        "/buyer/offers");
            }
        }
    }

    private void expireListingOffers(LocalDateTime now) {
        List<SlaughterhouseListingOffer> expired =
                listingOfferRepository.findByStatusAndExpiresAtBefore(OfferStatus.PENDING, now);
        for (SlaughterhouseListingOffer offer : expired) {
            offer.setStatus(OfferStatus.REJECTED);
            offer.setNote("Süre doldu (48 saat)");
            listingOfferRepository.save(offer);
            if (offer.getSlaughterhouse() != null) {
                inboxNotificationService.create(
                        offer.getSlaughterhouse(),
                        NotificationType.OFFER,
                        "Teklif süresi doldu",
                        "Hayvan teklifinizin yanıt süresi doldu.",
                        "/slaughterhouse/offers");
            }
        }
    }

    private void expireAnimalOffers(LocalDateTime now) {
        List<AnimalOffer> expired = animalOfferRepository.findByStatusAndExpiresAtBefore(OfferStatus.PENDING, now);
        for (AnimalOffer offer : expired) {
            offer.setStatus(OfferStatus.REJECTED);
            offer.setNote("Süre doldu (48 saat)");
            animalOfferRepository.save(offer);
            if (offer.getSeller() != null) {
                inboxNotificationService.create(
                        offer.getSeller(),
                        NotificationType.OFFER,
                        "Teklif süresi doldu",
                        "Alış talebi teklifinizin yanıt süresi doldu.",
                        "/seller/offers");
            }
        }
    }
}
