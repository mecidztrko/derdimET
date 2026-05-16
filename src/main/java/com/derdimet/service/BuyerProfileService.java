package com.derdimet.service;

import com.derdimet.api.BuyerPurchaseItemResponse;
import com.derdimet.api.FavoriteSellerResponse;
import com.derdimet.entity.FavoriteSeller;
import com.derdimet.entity.User;
import com.derdimet.entity.UserRole;
import com.derdimet.repository.FavoriteSellerRepository;
import com.derdimet.repository.OrderRepository;
import com.derdimet.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class BuyerProfileService {

    private final FavoriteSellerRepository favoriteSellerRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final AccountGuardService accountGuard;

    @Transactional(readOnly = true)
    public List<FavoriteSellerResponse> listFavorites(User buyer) {
        return favoriteSellerRepository.findByBuyerOrderByCreatedAtDesc(buyer).stream()
                .map(FavoriteSellerResponse::fromEntity)
                .toList();
    }

    @Transactional
    public void addFavorite(User buyer, Long sellerId) {
        accountGuard.requireEmailVerified(buyer);
        if (favoriteSellerRepository.existsByBuyer_IdAndSeller_Id(buyer.getId(), sellerId)) {
            return;
        }
        User seller =
                userRepository
                        .findById(sellerId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Satıcı bulunamadı"));
        if (seller.getRole() != UserRole.ANIMAL_SELLER) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Seçilen kullanıcı satıcı değil");
        }
        FavoriteSeller f = new FavoriteSeller();
        f.setBuyer(buyer);
        f.setSeller(seller);
        favoriteSellerRepository.save(f);
    }

    @Transactional
    public void removeFavorite(User buyer, Long sellerId) {
        favoriteSellerRepository.findByBuyer_IdAndSeller_Id(buyer.getId(), sellerId).ifPresent(favoriteSellerRepository::delete);
    }

    @Transactional(readOnly = true)
    public List<BuyerPurchaseItemResponse> listPurchases(User buyer, int limit) {
        var all = orderRepository.findByBuyerOrderByCreatedAtDesc(buyer);
        return all.stream().limit(Math.max(1, Math.min(limit, 100))).map(BuyerPurchaseItemResponse::fromEntity).toList();
    }
}

