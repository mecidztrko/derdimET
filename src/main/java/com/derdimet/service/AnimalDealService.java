package com.derdimet.service;

import com.derdimet.entity.AnimalDeal;
import com.derdimet.entity.AnimalDealType;
import com.derdimet.entity.AnimalOffer;
import com.derdimet.entity.AnimalPurchaseRequest;
import com.derdimet.entity.OrderStatus;
import com.derdimet.entity.SlaughterhouseListingOffer;
import com.derdimet.entity.User;
import com.derdimet.repository.AnimalDealRepository;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AnimalDealService {

    private final AnimalDealRepository animalDealRepository;

    @Transactional
    public void recordAcceptedAnimalOffer(AnimalOffer offer) {
        if (animalDealRepository.existsByAnimalOffer_Id(offer.getId())) {
            return;
        }
        AnimalPurchaseRequest req = offer.getRequest();
        User slaughterhouse = req != null ? req.getCreatedBy() : null;
        User seller = offer.getSeller();
        if (slaughterhouse == null || seller == null) {
            return;
        }
        AnimalDeal deal = new AnimalDeal();
        deal.setDealType(AnimalDealType.PURCHASE_REQUEST);
        deal.setAnimalOffer(offer);
        deal.setSeller(seller);
        deal.setSlaughterhouse(slaughterhouse);
        deal.setPricePerKg(offer.getPricePerKg());
        deal.setQuantity(offer.getAnimalCount());
        deal.setTotalPrice(estimateTotal(offer.getPricePerKg(), offer.getAnimalCount()));
        deal.setStatus(OrderStatus.COMPLETED);
        animalDealRepository.save(deal);
    }

    @Transactional
    public void recordAcceptedListingOffer(SlaughterhouseListingOffer offer) {
        if (animalDealRepository.existsByListingOffer_Id(offer.getId())) {
            return;
        }
        var listing = offer.getListing();
        User seller = listing != null ? listing.getSeller() : null;
        User slaughterhouse = offer.getSlaughterhouse();
        if (slaughterhouse == null || seller == null) {
            return;
        }
        AnimalDeal deal = new AnimalDeal();
        deal.setDealType(AnimalDealType.DIRECT_LISTING);
        deal.setListingOffer(offer);
        deal.setSeller(seller);
        deal.setSlaughterhouse(slaughterhouse);
        deal.setPricePerKg(offer.getPricePerKg());
        deal.setQuantity(offer.getQuantity());
        deal.setTotalPrice(estimateTotal(offer.getPricePerKg(), offer.getQuantity()));
        deal.setStatus(OrderStatus.COMPLETED);
        animalDealRepository.save(deal);
    }

    private static BigDecimal estimateTotal(BigDecimal pricePerKg, Integer quantity) {
        if (pricePerKg == null || quantity == null || quantity <= 0) {
            return null;
        }
        return pricePerKg.multiply(BigDecimal.valueOf(quantity));
    }
}
