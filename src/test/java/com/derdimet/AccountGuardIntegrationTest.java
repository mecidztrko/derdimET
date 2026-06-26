package com.derdimet;

import static org.assertj.core.api.Assertions.assertThat;

import com.derdimet.api.CreateMeatOfferRequest;
import com.derdimet.api.CreateMeatSaleRequest;
import com.derdimet.api.CreateSlaughterhouseListingOfferRequest;
import com.derdimet.api.MeatSaleRequestResponse;
import com.derdimet.entity.AnimalCategory;
import com.derdimet.entity.UserRole;
import com.derdimet.support.AbstractApiIntegrationTest;
import com.derdimet.support.TestUserFactory;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

class AccountGuardIntegrationTest extends AbstractApiIntegrationTest {

    @Test
    void unverifiedBuyerCannotCreateMeatOffer() {
        TestUserFactory.TestUser slaughterhouse = users.verified(UserRole.SLAUGHTERHOUSE);
        TestUserFactory.TestUser unverifiedBuyer = users.unverified(UserRole.MEAT_BUYER);

        MeatSaleRequestResponse listing = createMeatListing(login(slaughterhouse));

        ResponseEntity<String> response = rest.postForEntity(
                "/api/buyer/meat-sale-requests/" + listing.id() + "/offers",
                bearerEntity(
                        login(unverifiedBuyer),
                        new CreateMeatOfferRequest(new BigDecimal("400.00"), new BigDecimal("10.0"), "Engellenmeli")),
                String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(response.getBody()).contains("e-posta");
    }

    @Test
    void unverifiedSlaughterhouseCannotCreateAnimalListingOffer() {
        TestUserFactory.TestUser seller = users.verified(UserRole.ANIMAL_SELLER);
        TestUserFactory.TestUser unverifiedSlaughterhouse = users.unverified(UserRole.SLAUGHTERHOUSE);

        var listingResponse = rest.postForEntity(
                "/api/seller/animal-listings",
                bearerEntity(
                        login(seller),
                        new com.derdimet.api.CreateSellerAnimalListingRequest(
                                AnimalCategory.KUCUKBAS,
                                "Koyun",
                                "Merinos",
                                12,
                                5,
                                new BigDecimal("45.0"),
                                new BigDecimal("95.00"),
                                "Konya",
                                "Guard test",
                                List.of())),
                com.derdimet.api.SellerAnimalListingResponse.class);
        assertThat(listingResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        ResponseEntity<String> response = rest.postForEntity(
                "/api/slaughterhouse/animal-listings/" + listingResponse.getBody().id() + "/offers",
                bearerEntity(
                        login(unverifiedSlaughterhouse),
                        new CreateSlaughterhouseListingOfferRequest(new BigDecimal("90.00"), 5, "Engellenmeli")),
                String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(response.getBody()).contains("e-posta");
    }

    private MeatSaleRequestResponse createMeatListing(String slaughterhouseToken) {
        ResponseEntity<MeatSaleRequestResponse> response = rest.postForEntity(
                "/api/slaughterhouse/meat-sale-requests",
                bearerEntity(
                        slaughterhouseToken,
                        new CreateMeatSaleRequest(
                                "Kuzu pirzola",
                                "Kuzu",
                                AnimalCategory.KUCUKBAS,
                                "Pirzola",
                                new BigDecimal("30.0"),
                                new BigDecimal("650.00"),
                                "Vakum",
                                "İstanbul",
                                "Guard test ilanı",
                                List.of(),
                                null)),
                MeatSaleRequestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        return response.getBody();
    }
}
