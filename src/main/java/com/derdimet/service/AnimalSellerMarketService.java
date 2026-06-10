package com.derdimet.service;

import com.derdimet.api.AnimalOfferResponse;
import com.derdimet.api.AnimalPurchaseRequestResponse;
import com.derdimet.api.CreateAnimalOfferRequest;
import com.derdimet.api.SellerAnimalOfferItemResponse;
import com.derdimet.entity.AnimalOffer;
import com.derdimet.entity.AnimalCategory;
import com.derdimet.entity.AnimalPurchaseRequest;
import com.derdimet.entity.FavoriteAnimalPurchaseRequest;
import com.derdimet.entity.OfferStatus;
import com.derdimet.entity.RequestStatus;
import com.derdimet.entity.User;
import com.derdimet.repository.AnimalOfferRepository;
import com.derdimet.repository.AnimalPurchaseRequestRepository;
import com.derdimet.repository.FavoriteAnimalPurchaseRequestRepository;
import java.math.BigDecimal;
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
public class AnimalSellerMarketService {

    private final AnimalPurchaseRequestRepository requestRepository;
    private final AnimalOfferRepository offerRepository;
    private final FavoriteAnimalPurchaseRequestRepository favoritePurchaseRequestRepository;
    private final AccountGuardService accountGuard;

    @Transactional(readOnly = true)
    public List<AnimalPurchaseRequestResponse> listOpenPurchaseRequests(
            User seller,
            AnimalCategory category,
            String q,
            Integer quantityMin,
            Integer quantityMax,
            BigDecimal expectedWeightMin,
            BigDecimal expectedWeightMax,
            String sort) {
        Specification<AnimalPurchaseRequest> spec = Specification.where((root, query, cb) -> cb.equal(root.get("status"), RequestStatus.OPEN));

        if (category != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("animalCategory"), category));
        }
        if (q != null && !q.isBlank()) {
            String like = "%" + q.trim().toLowerCase() + "%";
            spec =
                    spec.and(
                            (root, query, cb) ->
                                    cb.or(
                                            cb.like(cb.lower(root.get("title")), like),
                                            cb.like(cb.lower(cb.coalesce(root.get("description"), "")), like)));
        }
        if (quantityMin != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("quantity"), quantityMin));
        }
        if (quantityMax != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("quantity"), quantityMax));
        }
        if (expectedWeightMin != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("expectedWeight"), expectedWeightMin));
        }
        if (expectedWeightMax != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("expectedWeight"), expectedWeightMax));
        }

        Sort s = switch (sort == null ? "" : sort.trim().toLowerCase()) {
            case "quantityasc" -> Sort.by(Sort.Direction.ASC, "quantity").and(Sort.by(Sort.Direction.DESC, "createdAt"));
            case "quantitydesc" -> Sort.by(Sort.Direction.DESC, "quantity").and(Sort.by(Sort.Direction.DESC, "createdAt"));
            case "weightasc" -> Sort.by(Sort.Direction.ASC, "expectedWeight").and(Sort.by(Sort.Direction.DESC, "createdAt"));
            case "weightdesc" -> Sort.by(Sort.Direction.DESC, "expectedWeight").and(Sort.by(Sort.Direction.DESC, "createdAt"));
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };

        return requestRepository.findAll(spec, s).stream()
                .map(r -> {
                    int offerCount = (int) offerRepository.countByRequest_Id(r.getId());
                    Boolean fav = isPurchaseRequestFavoritedByMe(seller, r.getId());
                    return AnimalPurchaseRequestResponse.fromEntity(r, fav, offerCount, null);
                })
                .toList();
    }

    @Transactional
    public AnimalOfferResponse createOffer(User seller, Long requestId, CreateAnimalOfferRequest body) {
        accountGuard.requireEmailVerified(seller);
        AnimalPurchaseRequest req = requestRepository
                .findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "İlan bulunamadı"));
        if (req.getStatus() != RequestStatus.OPEN) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bu ilan kapalı veya teklif almıyor");
        }
        if (offerRepository.existsByRequest_IdAndSeller_Id(requestId, seller.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bu ilan için zaten teklif verdiniz");
        }
        AnimalOffer o = new AnimalOffer();
        o.setRequest(req);
        o.setSeller(seller);
        o.setPricePerKg(body.pricePerKg());
        o.setAnimalCount(body.animalCount());
        o.setNote(blankToNull(body.note()));
        o.setStatus(OfferStatus.PENDING);
        return AnimalOfferResponse.fromEntity(offerRepository.save(o));
    }

    @Transactional(readOnly = true)
    public List<SellerAnimalOfferItemResponse> listMyOffers(User seller) {
        return offerRepository.findBySellerOrderByCreatedAtDesc(seller).stream()
                .map(SellerAnimalOfferItemResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AnimalPurchaseRequestResponse> listFavoritePurchaseRequests(User seller) {
        return favoritePurchaseRequestRepository.findBySeller_IdOrderByCreatedAtDesc(seller.getId()).stream()
                .map(FavoriteAnimalPurchaseRequest::getPurchaseRequest)
                .filter(java.util.Objects::nonNull)
                .map(r -> AnimalPurchaseRequestResponse.fromEntity(r, true, null, null))
                .toList();
    }

    @Transactional(readOnly = true)
    public boolean isPurchaseRequestFavoritedByMe(User seller, Long purchaseRequestId) {
        return favoritePurchaseRequestRepository.existsBySeller_IdAndPurchaseRequest_Id(
                seller.getId(), purchaseRequestId);
    }

    @Transactional
    public boolean togglePurchaseRequestFavorite(User seller, Long purchaseRequestId) {
        accountGuard.requireEmailVerified(seller);
        AnimalPurchaseRequest req =
                requestRepository
                        .findById(purchaseRequestId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "İlan bulunamadı"));
        var existing =
                favoritePurchaseRequestRepository.findBySeller_IdAndPurchaseRequest_Id(
                        seller.getId(), purchaseRequestId);
        if (existing.isPresent()) {
            favoritePurchaseRequestRepository.delete(existing.get());
            return false;
        }
        var fav = new FavoriteAnimalPurchaseRequest();
        fav.setSeller(seller);
        fav.setPurchaseRequest(req);
        favoritePurchaseRequestRepository.save(fav);
        return true;
    }

    private static String blankToNull(String s) {
        if (s == null || s.isBlank()) {
            return null;
        }
        return s.trim();
    }
}
