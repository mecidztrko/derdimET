package com.derdimet.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.derdimet.api.CreateMeatOfferRequest;
import com.derdimet.api.CreateMeatSaleRequest;
import com.derdimet.api.CreateSellerAnimalListingRequest;
import com.derdimet.api.CreateSlaughterhouseListingOfferRequest;
import com.derdimet.entity.AnimalCategory;
import com.derdimet.entity.OfferStatus;
import com.derdimet.entity.UserRole;
import com.derdimet.repository.AnimalDealRepository;
import com.derdimet.repository.OrderRepository;
import com.derdimet.support.TestUserFactory;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class MarketServiceIntegrationTest {

    @Autowired
    private TestUserFactory users;

    @Autowired
    private SellerListingService sellerListingService;

    @Autowired
    private SlaughterhouseListingMarketService slaughterhouseListingMarketService;

    @Autowired
    private MeatMarketService meatMarketService;

    @Autowired
    private AnimalDealRepository animalDealRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Test
    void slaughterhouseListingMarketServiceRecordsAnimalDeal() {
        var seller = users.verified(UserRole.ANIMAL_SELLER);
        var slaughterhouse = users.verified(UserRole.SLAUGHTERHOUSE);

        var listing = sellerListingService.create(
                seller.entity(),
                new CreateSellerAnimalListingRequest(
                        AnimalCategory.BUYUKBAS,
                        "Dana",
                        null,
                        18,
                        3,
                        new BigDecimal("500"),
                        new BigDecimal("170"),
                        "Ankara",
                        "Servis test",
                        List.of()));

        var offer = slaughterhouseListingMarketService.createOffer(
                slaughterhouse.entity(),
                listing.id(),
                new CreateSlaughterhouseListingOfferRequest(new BigDecimal("165"), 3, "Servis teklif"));

        slaughterhouseListingMarketService.respondToListingOffer(seller.entity(), offer.offerId(), true);

        assertThat(animalDealRepository.existsByListingOffer_Id(offer.offerId())).isTrue();
    }

    @Test
    void meatMarketServiceCreatesOrderOnAccept() {
        var slaughterhouse = users.verified(UserRole.SLAUGHTERHOUSE);
        var buyer = users.verified(UserRole.MEAT_BUYER);

        var saleRequest = meatMarketService.createSaleRequest(
                slaughterhouse.entity(),
                new CreateMeatSaleRequest(
                        "Kıyma",
                        "Dana",
                        AnimalCategory.BUYUKBAS,
                        "Kıyma",
                        new BigDecimal("80"),
                        new BigDecimal("390"),
                        null,
                        "Ankara",
                        "Servis test",
                        List.of(),
                        null));

        var offer = meatMarketService.createOffer(
                buyer.entity(),
                saleRequest.id(),
                new CreateMeatOfferRequest(new BigDecimal("385"), new BigDecimal("20"), "Servis teklif"));

        var accepted = meatMarketService.respondToMeatOffer(slaughterhouse.entity(), offer.offerId(), true);

        assertThat(accepted.status()).isEqualTo(OfferStatus.ACCEPTED);
        assertThat(orderRepository.existsByMeatOffer_Id(offer.offerId())).isTrue();
    }
}
