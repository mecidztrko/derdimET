package com.derdimet.service;

import com.derdimet.api.AnimalPurchaseRequestResponse;
import com.derdimet.api.CreateAnimalPurchaseRequest;
import com.derdimet.api.PurchaseRequestIncomingOfferResponse;
import com.derdimet.api.UpdateAnimalPurchaseRequest;
import com.derdimet.entity.AnimalOffer;
import com.derdimet.entity.AnimalPurchaseRequest;
import com.derdimet.entity.OfferStatus;
import com.derdimet.entity.RequestStatus;
import com.derdimet.entity.User;
import com.derdimet.repository.AnimalOfferRepository;
import com.derdimet.repository.AnimalPurchaseRequestRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AnimalPurchaseAdminService {

    private final AnimalPurchaseRequestRepository requestRepository;
    private final AnimalOfferRepository offerRepository;
    private final AnimalDealService animalDealService;
    private final AccountGuardService accountGuard;

    @Transactional
    public AnimalPurchaseRequestResponse create(User slaughterhouse, CreateAnimalPurchaseRequest req) {
        accountGuard.requireEmailVerified(slaughterhouse);
        AnimalPurchaseRequest e = new AnimalPurchaseRequest();
        e.setTitle(req.title().trim());
        e.setAnimalCategory(req.animalCategory());
        e.setQuantity(req.quantity());
        e.setExpectedWeight(req.expectedWeight());
        e.setDescription(blankToNull(req.description()));
        e.setStatus(RequestStatus.OPEN);
        e.setCreatedBy(slaughterhouse);
        return toResponse(requestRepository.save(e), null);
    }

    @Transactional(readOnly = true)
    public List<AnimalPurchaseRequestResponse> listMyRequests(User slaughterhouse, String q) {
        Specification<AnimalPurchaseRequest> spec =
                (root, query, cb) -> cb.equal(root.get("createdBy"), slaughterhouse);
        if (q != null && !q.isBlank()) {
            String like = "%" + q.trim().toLowerCase() + "%";
            spec =
                    spec.and(
                            (root, query, cb) ->
                                    cb.or(
                                            cb.like(cb.lower(root.get("title")), like),
                                            cb.like(cb.lower(cb.coalesce(root.get("description"), "")), like)));
        }
        return requestRepository
                .findAll(spec, Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(r -> toResponse(r, null))
                .toList();
    }

    @Transactional
    public AnimalPurchaseRequestResponse update(
            User slaughterhouse, Long requestId, UpdateAnimalPurchaseRequest body) {
        AnimalPurchaseRequest req = requestRepository
                .findByIdAndCreatedBy_Id(requestId, slaughterhouse.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Talep bulunamadı"));
        if (req.getStatus() != RequestStatus.OPEN) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Kapalı talep düzenlenemez");
        }
        if (body.title() != null && !body.title().isBlank()) {
            req.setTitle(body.title().trim());
        }
        if (body.animalCategory() != null) {
            req.setAnimalCategory(body.animalCategory());
        }
        if (body.quantity() != null) {
            req.setQuantity(body.quantity());
        }
        if (body.expectedWeight() != null) {
            req.setExpectedWeight(body.expectedWeight());
        }
        if (body.description() != null) {
            req.setDescription(blankToNull(body.description()));
        }
        return toResponse(requestRepository.save(req), null);
    }

    @Transactional
    public AnimalPurchaseRequestResponse close(User slaughterhouse, Long requestId) {
        accountGuard.requireEmailVerified(slaughterhouse);
        AnimalPurchaseRequest req = requestRepository
                .findByIdAndCreatedBy_Id(requestId, slaughterhouse.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Talep bulunamadı"));
        if (req.getStatus() != RequestStatus.OPEN) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Talep zaten kapalı");
        }
        req.setStatus(RequestStatus.CLOSED);
        return toResponse(requestRepository.save(req), null);
    }

    @Transactional
    public AnimalPurchaseRequestResponse reopen(User slaughterhouse, Long requestId) {
        accountGuard.requireEmailVerified(slaughterhouse);
        AnimalPurchaseRequest req = requestRepository
                .findByIdAndCreatedBy_Id(requestId, slaughterhouse.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Talep bulunamadı"));
        if (req.getStatus() != RequestStatus.CLOSED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Yalnızca kapalı talepler yeniden açılabilir");
        }
        boolean hasAccepted =
                offerRepository.findByRequest_IdAndStatus(requestId, OfferStatus.ACCEPTED).stream()
                        .findAny()
                        .isPresent();
        if (hasAccepted) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Kabul edilmiş teklifi olan talep yeniden açılamaz");
        }
        req.setStatus(RequestStatus.OPEN);
        return toResponse(requestRepository.save(req), null);
    }

    @Transactional(readOnly = true)
    public List<PurchaseRequestIncomingOfferResponse> listIncomingOffers(User slaughterhouse, Long requestId) {
        requestRepository
                .findByIdAndCreatedBy_Id(requestId, slaughterhouse.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Talep bulunamadı"));
        return offerRepository.findByRequest_IdOrderByCreatedAtDesc(requestId).stream()
                .map(PurchaseRequestIncomingOfferResponse::fromEntity)
                .toList();
    }

    @Transactional
    public PurchaseRequestIncomingOfferResponse respondToOffer(User slaughterhouse, Long offerId, boolean accept) {
        accountGuard.requireEmailVerified(slaughterhouse);
        AnimalOffer offer = offerRepository
                .findByIdAndRequest_CreatedBy_Id(offerId, slaughterhouse.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teklif bulunamadı"));
        if (offer.getStatus() != OfferStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Teklif zaten işlenmiş");
        }
        AnimalPurchaseRequest req = offer.getRequest();
        if (accept) {
            offer.setStatus(OfferStatus.ACCEPTED);
            offerRepository.save(offer);
            for (AnimalOffer other : offerRepository.findByRequest_IdAndStatus(req.getId(), OfferStatus.PENDING)) {
                if (!other.getId().equals(offerId)) {
                    other.setStatus(OfferStatus.REJECTED);
                    offerRepository.save(other);
                }
            }
            if (req.getStatus() == RequestStatus.OPEN) {
                req.setStatus(RequestStatus.CLOSED);
                requestRepository.save(req);
            }
            animalDealService.recordAcceptedAnimalOffer(offer);
        } else {
            offer.setStatus(OfferStatus.REJECTED);
            offerRepository.save(offer);
        }
        return PurchaseRequestIncomingOfferResponse.fromEntity(offer);
    }

    private AnimalPurchaseRequestResponse toResponse(AnimalPurchaseRequest e, Boolean isFavoritedByMe) {
        int offerCount = (int) offerRepository.countByRequest_Id(e.getId());
        int pendingOfferCount = (int) offerRepository.countByRequest_IdAndStatus(e.getId(), OfferStatus.PENDING);
        return AnimalPurchaseRequestResponse.fromEntity(e, isFavoritedByMe, offerCount, pendingOfferCount);
    }

    private static String blankToNull(String s) {
        if (s == null || s.isBlank()) {
            return null;
        }
        return s.trim();
    }
}
