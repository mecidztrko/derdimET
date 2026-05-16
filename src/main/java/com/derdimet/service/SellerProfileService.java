package com.derdimet.service;

import com.derdimet.api.FavoriteBuyerResponse;
import com.derdimet.api.SellerSaleItemResponse;
import com.derdimet.entity.FavoriteBuyer;
import com.derdimet.entity.OfferStatus;
import com.derdimet.entity.User;
import com.derdimet.entity.UserRole;
import com.derdimet.repository.AnimalDealRepository;
import com.derdimet.repository.AnimalOfferRepository;
import com.derdimet.repository.FavoriteBuyerRepository;
import com.derdimet.repository.SlaughterhouseListingOfferRepository;
import com.derdimet.repository.UserRepository;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class SellerProfileService {

    private final FavoriteBuyerRepository favoriteBuyerRepository;
    private final UserRepository userRepository;
    private final AnimalOfferRepository animalOfferRepository;
    private final SlaughterhouseListingOfferRepository listingOfferRepository;
    private final AnimalDealRepository animalDealRepository;
    private final AccountGuardService accountGuard;

    @Transactional(readOnly = true)
    public List<FavoriteBuyerResponse> listFavorites(User seller) {
        return favoriteBuyerRepository.findBySellerOrderByCreatedAtDesc(seller).stream()
                .map(FavoriteBuyerResponse::fromEntity)
                .toList();
    }

    @Transactional
    public void addFavorite(User seller, Long buyerId) {
        accountGuard.requireEmailVerified(seller);
        if (favoriteBuyerRepository.existsBySeller_IdAndBuyer_Id(seller.getId(), buyerId)) {
            return;
        }
        User buyer =
                userRepository
                        .findById(buyerId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Alıcı bulunamadı"));
        if (buyer.getRole() != UserRole.SLAUGHTERHOUSE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Seçilen kullanıcı kesimhane değil");
        }
        FavoriteBuyer f = new FavoriteBuyer();
        f.setSeller(seller);
        f.setBuyer(buyer);
        favoriteBuyerRepository.save(f);
    }

    @Transactional
    public void removeFavorite(User seller, Long buyerId) {
        favoriteBuyerRepository.findBySeller_IdAndBuyer_Id(seller.getId(), buyerId).ifPresent(favoriteBuyerRepository::delete);
    }

    @Transactional(readOnly = true)
    public List<SellerSaleItemResponse> listSales(User seller, int limit) {
        int cap = Math.max(1, Math.min(limit, 100));
        var merged = new ArrayList<SellerSaleItemResponse>();
        animalDealRepository.findBySellerOrderByCreatedAtDesc(seller).stream()
                .map(SellerSaleItemResponse::fromAnimalDeal)
                .filter(java.util.Objects::nonNull)
                .forEach(merged::add);
        animalOfferRepository.findBySellerAndStatusOrderByCreatedAtDesc(seller, OfferStatus.ACCEPTED).stream()
                .filter(o -> !animalDealRepository.existsByAnimalOffer_Id(o.getId()))
                .map(SellerSaleItemResponse::fromPurchaseRequestOffer)
                .forEach(merged::add);
        listingOfferRepository.findByListing_SellerAndStatusOrderByCreatedAtDesc(seller, OfferStatus.ACCEPTED).stream()
                .filter(o -> !animalDealRepository.existsByListingOffer_Id(o.getId()))
                .map(SellerSaleItemResponse::fromListingOffer)
                .forEach(merged::add);
        merged.sort(Comparator.comparing(SellerSaleItemResponse::createdAt).reversed());
        return merged.size() <= cap ? merged : merged.subList(0, cap);
    }
}

