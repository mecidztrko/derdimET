package com.derdimet.api;

import com.derdimet.entity.User;
import com.derdimet.entity.UserRole;
import com.derdimet.repository.AnimalPurchaseRequestRepository;
import com.derdimet.repository.MeatSaleRequestRepository;
import com.derdimet.repository.SellerAnimalListingRepository;
import com.derdimet.repository.SlaughterhouseListingOfferRepository;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.AnimalSellerMarketService;
import com.derdimet.service.MeatMarketService;
import com.derdimet.service.SlaughterhouseListingMarketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * Tüm rollerin erişebileceği ilan detay endpoint'leri. Mobilde liste → detay sayfasında kullanılır.
 * Response içinde "isFavoritedByMe" ile mevcut kullanıcının ilan sahibini favorileyip favorilemediği bilgisi gelir.
 */
@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
public class ListingDetailController {

    private final UserRepository userRepository;
    private final SellerAnimalListingRepository sellerAnimalListingRepository;
    private final MeatSaleRequestRepository meatSaleRequestRepository;
    private final AnimalPurchaseRequestRepository animalPurchaseRequestRepository;
    private final MeatMarketService meatMarketService;
    private final AnimalSellerMarketService animalSellerMarketService;
    private final SlaughterhouseListingMarketService slaughterhouseListingMarketService;
    private final SlaughterhouseListingOfferRepository listingOfferRepository;

    @Transactional(readOnly = true)
    @GetMapping("/animal/{id}")
    public ResponseEntity<SellerAnimalListingResponse> animalListing(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long id) {
        var listing = sellerAnimalListingRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "İlan bulunamadı"));
        Boolean fav = resolveAnimalListingFavorite(principal, id);
        Boolean hasOffer = checkHasOfferFromMe(principal, id);
        return ResponseEntity.ok(SellerAnimalListingResponse.fromEntity(listing, fav, hasOffer));
    }

    @Transactional(readOnly = true)
    @GetMapping("/meat/{id}")
    public ResponseEntity<MeatSaleRequestResponse> meatSaleRequest(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long id) {
        var sale = meatSaleRequestRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "İlan bulunamadı"));
        Boolean fav = resolveMeatListingFavorite(principal, id);
        return ResponseEntity.ok(MeatSaleRequestResponse.fromEntity(sale, fav));
    }

    @Transactional(readOnly = true)
    @GetMapping("/animal-request/{id}")
    public ResponseEntity<AnimalPurchaseRequestResponse> animalPurchaseRequest(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long id) {
        var req = animalPurchaseRequestRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "İlan bulunamadı"));
        Boolean fav = resolveAnimalPurchaseRequestFavorite(principal, id);
        return ResponseEntity.ok(AnimalPurchaseRequestResponse.fromEntity(req, fav));
    }

    private Boolean resolveMeatListingFavorite(UserDetails principal, Long listingId) {
        if (principal == null) {
            return null;
        }
        return userRepository
                .findByEmail(principal.getUsername())
                .map(
                        me -> {
                            if (me.getRole() != UserRole.MEAT_BUYER) {
                                return null;
                            }
                            return meatMarketService.isListingFavoritedByMe(me, listingId);
                        })
                .orElse(null);
    }

    private Boolean resolveAnimalPurchaseRequestFavorite(UserDetails principal, Long requestId) {
        if (principal == null) {
            return null;
        }
        return userRepository
                .findByEmail(principal.getUsername())
                .map(
                        me -> {
                            if (me.getRole() != UserRole.ANIMAL_SELLER) {
                                return null;
                            }
                            return animalSellerMarketService.isPurchaseRequestFavoritedByMe(me, requestId);
                        })
                .orElse(null);
    }

    private Boolean resolveAnimalListingFavorite(UserDetails principal, Long listingId) {
        if (principal == null) {
            return null;
        }
        return userRepository
                .findByEmail(principal.getUsername())
                .map(
                        me -> {
                            if (me.getRole() != UserRole.SLAUGHTERHOUSE) {
                                return null;
                            }
                            return slaughterhouseListingMarketService.isListingFavoritedByMe(me, listingId);
                        })
                .orElse(null);
    }

    private Boolean checkHasOfferFromMe(UserDetails principal, Long listingId) {
        if (principal == null) return null;
        return userRepository
                .findByEmail(principal.getUsername())
                .map(
                        me -> {
                            if (me.getRole() != UserRole.SLAUGHTERHOUSE) return null;
                            return listingOfferRepository.existsByListing_IdAndSlaughterhouse_Id(
                                    listingId, me.getId());
                        })
                .orElse(null);
    }
}
