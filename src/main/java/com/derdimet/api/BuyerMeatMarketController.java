package com.derdimet.api;

import com.derdimet.entity.AnimalCategory;
import com.derdimet.entity.User;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.MeatMarketService;
import com.derdimet.service.OrderPaymentService;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class BuyerMeatMarketController {

    private final UserRepository userRepository;
    private final MeatMarketService meatMarketService;
    private final OrderPaymentService orderPaymentService;

    /** Et alıcılarının gördüğü: kesimhanelerin açtığı açık et ilanları. */
    @GetMapping("/api/buyer/favorite-meat-sale-requests")
    public List<MeatSaleRequestResponse> listFavoriteMeatSaleRequests(
            @AuthenticationPrincipal UserDetails principal) {
        User buyer = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return meatMarketService.listFavoriteMeatSaleRequests(buyer);
    }

    @GetMapping("/api/buyer/meat-sale-requests")
    public List<MeatSaleRequestResponse> listOpenSaleRequests(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) BigDecimal priceMin,
            @RequestParam(required = false) BigDecimal priceMax,
            @RequestParam(required = false) AnimalCategory animalCategory,
            @RequestParam(required = false) LocalDate createdAfter) {
        User buyer = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        LocalDateTime createdAfterDt = createdAfter != null ? createdAfter.atStartOfDay() : null;
        return meatMarketService.listOpenSaleRequests(
                buyer, q, city, priceMin, priceMax, animalCategory, createdAfterDt);
    }

    @PostMapping("/api/buyer/meat-sale-requests/{saleRequestId}/offers")
    public ResponseEntity<MeatOfferItemResponse> createOffer(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long saleRequestId,
            @Valid @RequestBody CreateMeatOfferRequest body) {
        User buyer = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.status(HttpStatus.CREATED).body(meatMarketService.createOffer(buyer, saleRequestId, body));
    }

    @GetMapping("/api/buyer/meat-offers")
    public List<MeatOfferItemResponse> listMyOffers(
            @AuthenticationPrincipal UserDetails principal, @RequestParam(required = false) String q) {
        User buyer = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return meatMarketService.listMyOffers(buyer, q);
    }

    /** Bekleyen teklifi alıcı geri çeker. */
    @PostMapping("/api/buyer/meat-offers/{offerId}/withdraw")
    public ResponseEntity<MeatOfferItemResponse> withdrawOffer(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long offerId) {
        User buyer = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(meatMarketService.withdrawOffer(buyer, offerId));
    }

    /** Bekleyen teklifi alıcı kabul eder; tekliflerimde Kabul olarak görünür. */
    @PostMapping("/api/buyer/meat-offers/{offerId}/accept")
    public ResponseEntity<MeatOfferItemResponse> acceptOffer(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long offerId) {
        User buyer = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(meatMarketService.acceptMyOffer(buyer, offerId));
    }

    @PatchMapping("/api/buyer/meat-offers/{offerId}/revise")
    public ResponseEntity<MeatOfferItemResponse> reviseOffer(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long offerId,
            @Valid @RequestBody ReviseMeatOfferRequest body) {
        User buyer = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(meatMarketService.reviseOffer(buyer, offerId, body));
    }

    @GetMapping("/api/buyer/meat-offers/{offerId}/history")
    public List<OfferEventResponse> offerHistory(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long offerId) {
        User buyer = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return meatMarketService.listOfferHistory(buyer, offerId);
    }

    @PostMapping("/api/buyer/orders/{orderId}/confirm-payment")
    public ResponseEntity<BuyerPurchaseItemResponse> confirmPayment(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long orderId) {
        User buyer = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(orderPaymentService.confirmMockPayment(buyer, orderId));
    }

    @PostMapping("/api/buyer/orders/{orderId}/complete")
    public ResponseEntity<BuyerPurchaseItemResponse> completeOrder(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long orderId) {
        User buyer = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(orderPaymentService.completeOrder(buyer, orderId));
    }

    /** Tekil et ilanını favorile / favoriden çıkar. */
    @PostMapping("/api/buyer/meat-sale-requests/{saleRequestId}/favorite/toggle")
    public ResponseEntity<FavoriteToggleController.ToggleResponse> toggleListingFavorite(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long saleRequestId) {
        User buyer = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        boolean now = meatMarketService.toggleListingFavorite(buyer, saleRequestId);
        return ResponseEntity.ok(new FavoriteToggleController.ToggleResponse(now));
    }
}

