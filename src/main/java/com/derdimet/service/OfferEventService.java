package com.derdimet.service;

import com.derdimet.entity.AnimalOffer;
import com.derdimet.entity.MeatOffer;
import com.derdimet.entity.OfferEvent;
import com.derdimet.entity.OfferEventType;
import com.derdimet.entity.OfferKind;
import com.derdimet.entity.SlaughterhouseListingOffer;
import com.derdimet.repository.OfferEventRepository;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OfferEventService {

    private final OfferEventRepository offerEventRepository;

    @Transactional
    public void record(
            OfferKind kind,
            Long offerId,
            OfferEventType eventType,
            BigDecimal pricePerKg,
            BigDecimal quantity,
            String note,
            Integer revisionNumber) {
        OfferEvent event = new OfferEvent();
        event.setOfferKind(kind);
        event.setOfferId(offerId);
        event.setEventType(eventType);
        event.setPricePerKg(pricePerKg);
        event.setQuantity(quantity);
        event.setNote(note);
        event.setRevisionNumber(revisionNumber);
        offerEventRepository.save(event);
    }

    @Transactional
    public void recordCreated(MeatOffer offer) {
        record(
                OfferKind.MEAT,
                offer.getId(),
                OfferEventType.CREATED,
                offer.getPricePerKg(),
                offer.getQuantity(),
                offer.getNote(),
                offer.getRevisionNumber());
    }

    @Transactional
    public void recordRevised(MeatOffer offer) {
        record(
                OfferKind.MEAT,
                offer.getId(),
                OfferEventType.REVISED,
                offer.getPricePerKg(),
                offer.getQuantity(),
                offer.getNote(),
                offer.getRevisionNumber());
    }

    @Transactional
    public void recordCreated(SlaughterhouseListingOffer offer) {
        record(
                OfferKind.LISTING,
                offer.getId(),
                OfferEventType.CREATED,
                offer.getPricePerKg(),
                offer.getQuantity() != null ? BigDecimal.valueOf(offer.getQuantity()) : null,
                offer.getNote(),
                offer.getRevisionNumber());
    }

    @Transactional
    public void recordCreated(AnimalOffer offer) {
        record(
                OfferKind.ANIMAL,
                offer.getId(),
                OfferEventType.CREATED,
                offer.getPricePerKg(),
                offer.getAnimalCount() != null ? BigDecimal.valueOf(offer.getAnimalCount()) : null,
                offer.getNote(),
                offer.getRevisionNumber());
    }

    @Transactional
    public void recordRevised(SlaughterhouseListingOffer offer) {
        record(
                OfferKind.LISTING,
                offer.getId(),
                OfferEventType.REVISED,
                offer.getPricePerKg(),
                offer.getQuantity() != null ? BigDecimal.valueOf(offer.getQuantity()) : null,
                offer.getNote(),
                offer.getRevisionNumber());
    }

    @Transactional
    public void recordRevised(AnimalOffer offer) {
        record(
                OfferKind.ANIMAL,
                offer.getId(),
                OfferEventType.REVISED,
                offer.getPricePerKg(),
                offer.getAnimalCount() != null ? BigDecimal.valueOf(offer.getAnimalCount()) : null,
                offer.getNote(),
                offer.getRevisionNumber());
    }
}
