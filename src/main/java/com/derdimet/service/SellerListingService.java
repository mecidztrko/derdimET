package com.derdimet.service;

import com.derdimet.api.CreateSellerAnimalListingRequest;
import com.derdimet.api.SellerAnimalListingResponse;
import com.derdimet.api.UpdateSellerAnimalListingRequest;
import com.derdimet.entity.RequestStatus;
import com.derdimet.entity.SellerAnimalListing;
import com.derdimet.entity.User;
import com.derdimet.repository.SellerAnimalListingRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class SellerListingService {

    private final SellerAnimalListingRepository listingRepository;
    private final AccountGuardService accountGuard;

    @Transactional
    public SellerAnimalListingResponse create(User seller, CreateSellerAnimalListingRequest body) {
        accountGuard.requireEmailVerified(seller);
        SellerAnimalListing e = new SellerAnimalListing();
        e.setSeller(seller);
        e.setCategory(body.category());
        e.setType(body.type().trim());
        e.setBreed(blankToNull(body.breed()));
        e.setAgeMonths(body.ageMonths());
        e.setQuantity(body.quantity());
        e.setAvgWeightKg(body.avgWeightKg());
        e.setPrice(body.price());
        e.setLocation(blankToNull(body.location()));
        e.setDescription(blankToNull(body.description()));
        e.setImageUrls(joinImageUrls(body.imageUrls()));
        return SellerAnimalListingResponse.fromEntity(listingRepository.save(e));
    }

    @Transactional(readOnly = true)
    public List<SellerAnimalListingResponse> myListings(User seller) {
        return listingRepository.findBySellerOrderByCreatedAtDesc(seller).stream()
                .map(SellerAnimalListingResponse::fromEntity)
                .toList();
    }

    @Transactional
    public SellerAnimalListingResponse updateListing(User seller, Long listingId, UpdateSellerAnimalListingRequest body) {
        SellerAnimalListing listing =
                listingRepository
                        .findByIdAndSeller_Id(listingId, seller.getId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "İlan bulunamadı"));
        if (listing.getStatus() != RequestStatus.OPEN) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Kapalı ilan düzenlenemez");
        }
        if (body.category() != null) listing.setCategory(body.category());
        if (body.type() != null && !body.type().isBlank()) listing.setType(body.type().trim());
        if (body.breed() != null) listing.setBreed(blankToNull(body.breed()));
        if (body.ageMonths() != null) listing.setAgeMonths(body.ageMonths());
        if (body.quantity() != null) listing.setQuantity(body.quantity());
        if (body.avgWeightKg() != null) listing.setAvgWeightKg(body.avgWeightKg());
        if (body.price() != null) listing.setPrice(body.price());
        if (body.location() != null) listing.setLocation(blankToNull(body.location()));
        if (body.description() != null) listing.setDescription(blankToNull(body.description()));
        if (body.imageUrls() != null) listing.setImageUrls(joinImageUrls(body.imageUrls()));
        return SellerAnimalListingResponse.fromEntity(listingRepository.save(listing));
    }

    @Transactional
    public SellerAnimalListingResponse closeListing(User seller, Long listingId) {
        accountGuard.requireEmailVerified(seller);
        SellerAnimalListing listing =
                listingRepository
                        .findByIdAndSeller_Id(listingId, seller.getId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "İlan bulunamadı"));
        if (listing.getStatus() == RequestStatus.CLOSED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "İlan zaten kapalı");
        }
        listing.setStatus(RequestStatus.CLOSED);
        return SellerAnimalListingResponse.fromEntity(listingRepository.save(listing));
    }

    private static String blankToNull(String s) {
        if (s == null || s.isBlank()) return null;
        return s.trim();
    }

    private static String joinImageUrls(List<String> urls) {
        if (urls == null || urls.isEmpty()) return null;
        return String.join(
                ",",
                urls.stream().filter(u -> u != null && !u.isBlank()).map(String::trim).toList());
    }
}
