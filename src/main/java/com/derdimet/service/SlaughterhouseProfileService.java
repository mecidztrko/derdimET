package com.derdimet.service;

import com.derdimet.api.FavoriteMeatBuyerResponse;
import com.derdimet.api.SlaughterhousePurchaseItemResponse;
import com.derdimet.api.SlaughterhouseSaleItemResponse;
import com.derdimet.entity.FavoriteMeatBuyer;
import com.derdimet.entity.OfferStatus;
import com.derdimet.entity.User;
import com.derdimet.entity.UserRole;
import com.derdimet.repository.AnimalDealRepository;
import com.derdimet.repository.AnimalOfferRepository;
import com.derdimet.repository.FavoriteMeatBuyerRepository;
import com.derdimet.repository.OrderRepository;
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
public class SlaughterhouseProfileService {

    private final FavoriteMeatBuyerRepository favoriteMeatBuyerRepository;
    private final UserRepository userRepository;
    private final AnimalOfferRepository animalOfferRepository;
    private final OrderRepository orderRepository;
    private final SlaughterhouseListingOfferRepository listingOfferRepository;
    private final AnimalDealRepository animalDealRepository;
    private final AccountGuardService accountGuard;

    @Transactional(readOnly = true)
    public List<FavoriteMeatBuyerResponse> listFavoriteBuyers(User slaughterhouse) {
        return favoriteMeatBuyerRepository.findBySlaughterhouseOrderByCreatedAtDesc(slaughterhouse).stream()
                .map(FavoriteMeatBuyerResponse::fromEntity)
                .toList();
    }

    @Transactional
    public void addFavoriteBuyer(User slaughterhouse, Long buyerId) {
        accountGuard.requireEmailVerified(slaughterhouse);
        if (favoriteMeatBuyerRepository.existsBySlaughterhouse_IdAndBuyer_Id(slaughterhouse.getId(), buyerId)) {
            return;
        }
        User buyer =
                userRepository
                        .findById(buyerId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Alıcı bulunamadı"));
        if (buyer.getRole() != UserRole.MEAT_BUYER) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Seçilen kullanıcı et alıcı değil");
        }
        FavoriteMeatBuyer f = new FavoriteMeatBuyer();
        f.setSlaughterhouse(slaughterhouse);
        f.setBuyer(buyer);
        favoriteMeatBuyerRepository.save(f);
    }

    @Transactional
    public void removeFavoriteBuyer(User slaughterhouse, Long buyerId) {
        favoriteMeatBuyerRepository
                .findBySlaughterhouse_IdAndBuyer_Id(slaughterhouse.getId(), buyerId)
                .ifPresent(favoriteMeatBuyerRepository::delete);
    }

    @Transactional(readOnly = true)
    public List<SlaughterhousePurchaseItemResponse> listPurchases(User slaughterhouse, int limit) {
        int cap = Math.max(1, Math.min(limit, 100));
        var merged = new ArrayList<SlaughterhousePurchaseItemResponse>();
        animalDealRepository.findBySlaughterhouseOrderByCreatedAtDesc(slaughterhouse).stream()
                .map(SlaughterhousePurchaseItemResponse::fromAnimalDeal)
                .filter(java.util.Objects::nonNull)
                .forEach(merged::add);
        animalOfferRepository
                .findByRequest_CreatedByAndStatusOrderByCreatedAtDesc(slaughterhouse, OfferStatus.ACCEPTED)
                .stream()
                .filter(o -> !animalDealRepository.existsByAnimalOffer_Id(o.getId()))
                .map(SlaughterhousePurchaseItemResponse::fromPurchaseRequestOffer)
                .forEach(merged::add);
        listingOfferRepository
                .findBySlaughterhouseAndStatusOrderByCreatedAtDesc(slaughterhouse, OfferStatus.ACCEPTED)
                .stream()
                .filter(o -> !animalDealRepository.existsByListingOffer_Id(o.getId()))
                .map(SlaughterhousePurchaseItemResponse::fromListingOffer)
                .forEach(merged::add);
        merged.sort(Comparator.comparing(SlaughterhousePurchaseItemResponse::createdAt).reversed());
        return merged.size() <= cap ? merged : merged.subList(0, cap);
    }

    @Transactional(readOnly = true)
    public List<SlaughterhouseSaleItemResponse> listSales(User slaughterhouse, int limit) {
        var all = orderRepository.findByMeatOffer_SaleRequest_SlaughterhouseOrderByCreatedAtDesc(slaughterhouse);
        return all.stream()
                .limit(Math.max(1, Math.min(limit, 100)))
                .map(SlaughterhouseSaleItemResponse::fromEntity)
                .toList();
    }
}

