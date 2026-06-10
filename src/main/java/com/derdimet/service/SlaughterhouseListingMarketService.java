package com.derdimet.service;

import com.derdimet.api.CreateSlaughterhouseListingOfferRequest;
import com.derdimet.api.ListingOfferResponse;
import com.derdimet.api.SellerAnimalListingResponse;
import com.derdimet.entity.OfferStatus;
import com.derdimet.entity.RequestStatus;
import com.derdimet.entity.SellerAnimalListing;
import com.derdimet.entity.User;
import com.derdimet.entity.AnimalCategory;
import com.derdimet.entity.UserRole;
import java.math.BigDecimal;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import com.derdimet.entity.FavoriteAnimalListing;
import com.derdimet.repository.FavoriteAnimalListingRepository;
import com.derdimet.repository.SellerAnimalListingRepository;
import com.derdimet.repository.SlaughterhouseListingOfferRepository;
import com.derdimet.util.ListingSearchSupport;
import com.derdimet.entity.SlaughterhouseListingOffer;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class SlaughterhouseListingMarketService {

    private final SellerAnimalListingRepository listingRepository;
    private final SlaughterhouseListingOfferRepository offerRepository;
    private final AnimalDealService animalDealService;
    private final AccountGuardService accountGuard;
    private final FavoriteAnimalListingRepository favoriteAnimalListingRepository;

    @Transactional(readOnly = true)
    public List<SellerAnimalListingResponse> searchListings(
            User slaughterhouse,
            AnimalCategory category,
            String typeQ,
            Integer ageMin,
            Integer ageMax,
            Integer quantityMin,
            Integer quantityMax,
            BigDecimal priceMin,
            BigDecimal priceMax,
            String sort,
            String q) {
        return searchListingsInternal(
                slaughterhouse,
                category,
                typeQ,
                ageMin,
                ageMax,
                quantityMin,
                quantityMax,
                priceMin,
                priceMax,
                sort,
                q,
                null);
    }

    /** Satıcı: diğer satıcıların açık ilanları (kendi ilanları hariç, salt okunur). */
    @Transactional(readOnly = true)
    public List<SellerAnimalListingResponse> browseMarketExcludingSeller(
            User viewer,
            AnimalCategory category,
            String typeQ,
            Integer ageMin,
            Integer ageMax,
            Integer quantityMin,
            Integer quantityMax,
            BigDecimal priceMin,
            BigDecimal priceMax,
            String sort,
            String q) {
        return searchListingsInternal(
                viewer,
                category,
                typeQ,
                ageMin,
                ageMax,
                quantityMin,
                quantityMax,
                priceMin,
                priceMax,
                sort,
                q,
                viewer.getId());
    }

    private List<SellerAnimalListingResponse> searchListingsInternal(
            User viewer,
            AnimalCategory category,
            String typeQ,
            Integer ageMin,
            Integer ageMax,
            Integer quantityMin,
            Integer quantityMax,
            BigDecimal priceMin,
            BigDecimal priceMax,
            String sort,
            String q,
            Long excludeSellerId) {
        Specification<SellerAnimalListing> spec =
                Specification.where((root, query, cb) -> cb.equal(root.get("status"), com.derdimet.entity.RequestStatus.OPEN));

        if (excludeSellerId != null) {
            spec = spec.and((root, query, cb) -> cb.notEqual(root.get("seller").get("id"), excludeSellerId));
        }

        if (category != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category"), category));
        }
        if (typeQ != null && !typeQ.isBlank()) {
            String like = "%" + typeQ.trim().toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("type")), like));
        }
        if (ageMin != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("ageMonths"), ageMin));
        }
        if (ageMax != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("ageMonths"), ageMax));
        }
        if (quantityMin != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("quantity"), quantityMin));
        }
        if (quantityMax != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("quantity"), quantityMax));
        }
        if (priceMin != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("price"), priceMin));
        }
        if (priceMax != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), priceMax));
        }

        Sort s =
                switch (sort == null ? "" : sort.trim().toLowerCase()) {
                    case "priceasc" -> Sort.by(Sort.Direction.ASC, "price").and(Sort.by(Sort.Direction.DESC, "createdAt"));
                    case "pricedesc" -> Sort.by(Sort.Direction.DESC, "price").and(Sort.by(Sort.Direction.DESC, "createdAt"));
                    case "newest", "" -> Sort.by(Sort.Direction.DESC, "createdAt");
                    default -> Sort.by(Sort.Direction.DESC, "createdAt");
                };

        Long viewerId = viewer != null ? viewer.getId() : null;
        UserRole viewerRole = viewer != null ? viewer.getRole() : null;
        return listingRepository.findAll(spec, s).stream()
                .filter(l -> ListingSearchSupport.matchesAnimalListing(l, q))
                .map(
                        l -> {
                            Boolean favorited =
                                    viewer != null && viewerRole == UserRole.SLAUGHTERHOUSE
                                            ? isListingFavoritedByMe(viewer, l.getId())
                                            : null;
                            Boolean offered =
                                    viewerId != null
                                            && viewerRole == UserRole.SLAUGHTERHOUSE
                                            && offerRepository.existsByListing_IdAndSlaughterhouse_Id(l.getId(), viewerId)
                                            ? true
                                            : null;
                            return SellerAnimalListingResponse.fromEntity(l, favorited, offered);
                        })
                .toList();
    }

    @Transactional
    public ListingOfferResponse createOffer(User slaughterhouse, Long listingId, CreateSlaughterhouseListingOfferRequest body) {
        accountGuard.requireEmailVerified(slaughterhouse);
        SellerAnimalListing listing =
                listingRepository
                        .findById(listingId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "İlan bulunamadı"));

        if (offerRepository.existsByListing_IdAndSlaughterhouse_Id(listingId, slaughterhouse.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bu ilan için zaten teklif verdiniz");
        }

        SlaughterhouseListingOffer o = new SlaughterhouseListingOffer();
        o.setListing(listing);
        o.setSlaughterhouse(slaughterhouse);
        o.setPricePerKg(body.pricePerKg());
        o.setQuantity(body.quantity());
        o.setNote(blankToNull(body.note()));
        o.setStatus(OfferStatus.PENDING);
        return ListingOfferResponse.fromEntity(offerRepository.save(o));
    }

    @Transactional(readOnly = true)
    public List<ListingOfferResponse> listOffersForSeller(User seller) {
        return offerRepository.findByListing_SellerOrderByCreatedAtDesc(seller).stream()
                .map(ListingOfferResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ListingOfferResponse> listMyOffers(User slaughterhouse) {
        return offerRepository.findBySlaughterhouseOrderByCreatedAtDesc(slaughterhouse).stream()
                .map(ListingOfferResponse::fromEntity)
                .toList();
    }

    @Transactional
    public ListingOfferResponse respondToListingOffer(User seller, Long offerId, boolean accept) {
        accountGuard.requireEmailVerified(seller);
        SlaughterhouseListingOffer offer =
                offerRepository
                        .findByIdAndListing_Seller_Id(offerId, seller.getId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teklif bulunamadı"));
        if (offer.getStatus() != OfferStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Teklif zaten işlenmiş");
        }
        if (accept) {
            offer.setStatus(OfferStatus.ACCEPTED);
            offerRepository.save(offer);
            Long listingId = offer.getListing().getId();
            for (SlaughterhouseListingOffer other :
                    offerRepository.findByListing_IdAndStatus(listingId, OfferStatus.PENDING)) {
                if (!other.getId().equals(offerId)) {
                    other.setStatus(OfferStatus.REJECTED);
                    offerRepository.save(other);
                }
            }
            SellerAnimalListing listing = offer.getListing();
            if (listing.getStatus() == RequestStatus.OPEN) {
                listing.setStatus(RequestStatus.CLOSED);
                listingRepository.save(listing);
            }
            animalDealService.recordAcceptedListingOffer(offer);
        } else {
            offer.setStatus(OfferStatus.REJECTED);
            offerRepository.save(offer);
        }
        return ListingOfferResponse.fromEntity(offer);
    }

    @Transactional(readOnly = true)
    public List<SellerAnimalListingResponse> listFavoriteAnimalListings(User slaughterhouse) {
        return favoriteAnimalListingRepository.findBySlaughterhouse_IdOrderByCreatedAtDesc(slaughterhouse.getId())
                .stream()
                .map(FavoriteAnimalListing::getListing)
                .filter(java.util.Objects::nonNull)
                .map(l -> SellerAnimalListingResponse.fromEntity(l, true, null))
                .toList();
    }

    @Transactional(readOnly = true)
    public boolean isListingFavoritedByMe(User slaughterhouse, Long listingId) {
        return favoriteAnimalListingRepository.existsBySlaughterhouse_IdAndListing_Id(
                slaughterhouse.getId(), listingId);
    }

    @Transactional
    public boolean toggleListingFavorite(User slaughterhouse, Long listingId) {
        accountGuard.requireEmailVerified(slaughterhouse);
        SellerAnimalListing listing =
                listingRepository
                        .findById(listingId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "İlan bulunamadı"));
        var existing =
                favoriteAnimalListingRepository.findBySlaughterhouse_IdAndListing_Id(
                        slaughterhouse.getId(), listingId);
        if (existing.isPresent()) {
            favoriteAnimalListingRepository.delete(existing.get());
            return false;
        }
        var fav = new FavoriteAnimalListing();
        fav.setSlaughterhouse(slaughterhouse);
        fav.setListing(listing);
        favoriteAnimalListingRepository.save(fav);
        return true;
    }

    private static String blankToNull(String s) {
        if (s == null || s.isBlank()) return null;
        return s.trim();
    }
}

