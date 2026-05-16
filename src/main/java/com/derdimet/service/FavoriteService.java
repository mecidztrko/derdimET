package com.derdimet.service;

import com.derdimet.entity.FavoriteBuyer;
import com.derdimet.entity.FavoriteMeatBuyer;
import com.derdimet.entity.FavoriteSeller;
import com.derdimet.entity.FavoriteSlaughterhouse;
import com.derdimet.entity.User;
import com.derdimet.entity.UserRole;
import com.derdimet.repository.FavoriteBuyerRepository;
import com.derdimet.repository.FavoriteMeatBuyerRepository;
import com.derdimet.repository.FavoriteSellerRepository;
import com.derdimet.repository.FavoriteSlaughterhouseRepository;
import com.derdimet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * Roller arası favori ilişkilerini tek noktadan yönetir. UI'dan kalp ikonuna basıldığında
 * çağrılan toggle, mevcut role'a göre doğru tabloya yazar.
 */
@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final UserRepository userRepository;
    private final FavoriteSellerRepository favoriteSellerRepository;
    private final FavoriteBuyerRepository favoriteBuyerRepository;
    private final FavoriteMeatBuyerRepository favoriteMeatBuyerRepository;
    private final FavoriteSlaughterhouseRepository favoriteSlaughterhouseRepository;
    private final AccountGuardService accountGuard;

    /** Ben (current) → target arası favori ilişkisini toggle eder, sonuç durumunu döner (true=eklendi, false=silindi). */
    @Transactional
    public boolean toggleFavorite(User me, Long targetUserId) {
        if (!isFavoritedByMe(me, targetUserId)) {
            accountGuard.requireEmailVerified(me);
        }
        User target = userRepository
                .findById(targetUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kullanıcı bulunamadı"));
        if (me.getId().equals(target.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Kendinizi favorileyemezsiniz");
        }

        UserRole myRole = me.getRole();
        UserRole targetRole = target.getRole();

        // SLAUGHTERHOUSE → ANIMAL_SELLER (favorite_sellers)
        if (myRole == UserRole.SLAUGHTERHOUSE && targetRole == UserRole.ANIMAL_SELLER) {
            return toggleFavoriteSeller(me, target);
        }
        // ANIMAL_SELLER → SLAUGHTERHOUSE (favorite_buyers)
        if (myRole == UserRole.ANIMAL_SELLER && targetRole == UserRole.SLAUGHTERHOUSE) {
            return toggleFavoriteBuyer(me, target);
        }
        // SLAUGHTERHOUSE → MEAT_BUYER (favorite_meat_buyers)
        if (myRole == UserRole.SLAUGHTERHOUSE && targetRole == UserRole.MEAT_BUYER) {
            return toggleFavoriteMeatBuyer(me, target);
        }
        // MEAT_BUYER → SLAUGHTERHOUSE (favorite_slaughterhouses)
        if (myRole == UserRole.MEAT_BUYER && targetRole == UserRole.SLAUGHTERHOUSE) {
            return toggleFavoriteSlaughterhouse(me, target);
        }

        throw new ResponseStatusException(HttpStatus.CONFLICT, "Bu rol kombinasyonu için favori desteklenmiyor");
    }

    /** Belirtilen kullanıcının current user tarafından favorilenip favorilenmediğini döner. */
    @Transactional(readOnly = true)
    public boolean isFavoritedByMe(User me, Long targetUserId) {
        if (me == null || targetUserId == null) return false;
        UserRole myRole = me.getRole();
        return switch (myRole) {
            case SLAUGHTERHOUSE -> favoriteSellerRepository.existsByBuyer_IdAndSeller_Id(me.getId(), targetUserId)
                    || favoriteMeatBuyerRepository.existsBySlaughterhouse_IdAndBuyer_Id(me.getId(), targetUserId);
            case ANIMAL_SELLER -> favoriteBuyerRepository.existsBySeller_IdAndBuyer_Id(me.getId(), targetUserId);
            case MEAT_BUYER -> favoriteSlaughterhouseRepository.existsByBuyer_IdAndSlaughterhouse_Id(
                    me.getId(), targetUserId);
            default -> false;
        };
    }

    private boolean toggleFavoriteSeller(User me, User seller) {
        var existing = favoriteSellerRepository.findByBuyer_IdAndSeller_Id(me.getId(), seller.getId());
        if (existing.isPresent()) {
            favoriteSellerRepository.delete(existing.get());
            return false;
        }
        FavoriteSeller f = new FavoriteSeller();
        f.setBuyer(me);
        f.setSeller(seller);
        favoriteSellerRepository.save(f);
        return true;
    }

    private boolean toggleFavoriteBuyer(User me, User slaughterhouse) {
        var existing = favoriteBuyerRepository.findBySeller_IdAndBuyer_Id(me.getId(), slaughterhouse.getId());
        if (existing.isPresent()) {
            favoriteBuyerRepository.delete(existing.get());
            return false;
        }
        FavoriteBuyer f = new FavoriteBuyer();
        f.setSeller(me);
        f.setBuyer(slaughterhouse);
        favoriteBuyerRepository.save(f);
        return true;
    }

    private boolean toggleFavoriteMeatBuyer(User me, User buyer) {
        var existing = favoriteMeatBuyerRepository.findBySlaughterhouse_IdAndBuyer_Id(me.getId(), buyer.getId());
        if (existing.isPresent()) {
            favoriteMeatBuyerRepository.delete(existing.get());
            return false;
        }
        FavoriteMeatBuyer f = new FavoriteMeatBuyer();
        f.setSlaughterhouse(me);
        f.setBuyer(buyer);
        favoriteMeatBuyerRepository.save(f);
        return true;
    }

    private boolean toggleFavoriteSlaughterhouse(User me, User slaughterhouse) {
        var existing =
                favoriteSlaughterhouseRepository.findByBuyer_IdAndSlaughterhouse_Id(me.getId(), slaughterhouse.getId());
        if (existing.isPresent()) {
            favoriteSlaughterhouseRepository.delete(existing.get());
            return false;
        }
        FavoriteSlaughterhouse f = new FavoriteSlaughterhouse();
        f.setBuyer(me);
        f.setSlaughterhouse(slaughterhouse);
        favoriteSlaughterhouseRepository.save(f);
        return true;
    }
}
