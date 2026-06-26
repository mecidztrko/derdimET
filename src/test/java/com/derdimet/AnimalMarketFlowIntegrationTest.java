package com.derdimet;

import static org.assertj.core.api.Assertions.assertThat;

import com.derdimet.api.CreateSellerAnimalListingRequest;
import com.derdimet.api.CreateSlaughterhouseListingOfferRequest;
import com.derdimet.api.ListingOfferResponse;
import com.derdimet.api.SellerAnimalListingResponse;
import com.derdimet.entity.AnimalCategory;
import com.derdimet.entity.OfferStatus;
import com.derdimet.entity.UserRole;
import com.derdimet.repository.AnimalDealRepository;
import com.derdimet.support.AbstractApiIntegrationTest;
import com.derdimet.support.TestUserFactory;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

class AnimalMarketFlowIntegrationTest extends AbstractApiIntegrationTest {

    @Autowired
    private AnimalDealRepository animalDealRepository;

    @Test
    void sellerListingOfferAcceptCreatesAnimalDeal() {
        TestUserFactory.TestUser seller = users.verified(UserRole.ANIMAL_SELLER);
        TestUserFactory.TestUser slaughterhouse = users.verified(UserRole.SLAUGHTERHOUSE);
        String sellerToken = login(seller);
        String slaughterhouseToken = login(slaughterhouse);

        SellerAnimalListingResponse listing = createListing(sellerToken);
        ListingOfferResponse offer = createOffer(slaughterhouseToken, listing.id());
        ListingOfferResponse accepted = acceptOffer(sellerToken, offer.offerId());

        assertThat(accepted.status()).isEqualTo(OfferStatus.ACCEPTED);
        assertThat(animalDealRepository.existsByListingOffer_Id(offer.offerId())).isTrue();
    }

    @Test
    void slaughterhouseCanBrowseSellerListings() {
        TestUserFactory.TestUser seller = users.verified(UserRole.ANIMAL_SELLER);
        TestUserFactory.TestUser slaughterhouse = users.verified(UserRole.SLAUGHTERHOUSE);
        SellerAnimalListingResponse listing = createListing(login(seller));

        ResponseEntity<List<SellerAnimalListingResponse>> response = rest.exchange(
                "/api/slaughterhouse/animal-listings",
                HttpMethod.GET,
                bearerEntity(login(slaughterhouse)),
                new ParameterizedTypeReference<>() {});

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).extracting(SellerAnimalListingResponse::id).contains(listing.id());
    }

    private SellerAnimalListingResponse createListing(String sellerToken) {
        ResponseEntity<SellerAnimalListingResponse> response = rest.postForEntity(
                "/api/seller/animal-listings",
                bearerEntity(
                        sellerToken,
                        new CreateSellerAnimalListingRequest(
                                AnimalCategory.BUYUKBAS,
                                "Sığır",
                                "Holstein",
                                24,
                                10,
                                new BigDecimal("450.0"),
                                new BigDecimal("185.50"),
                                "Ankara",
                                "Test ilanı",
                                List.of())),
                SellerAnimalListingResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        return response.getBody();
    }

    private ListingOfferResponse createOffer(String slaughterhouseToken, Long listingId) {
        ResponseEntity<ListingOfferResponse> response = rest.postForEntity(
                "/api/slaughterhouse/animal-listings/" + listingId + "/offers",
                bearerEntity(
                        slaughterhouseToken,
                        new CreateSlaughterhouseListingOfferRequest(new BigDecimal("180.00"), 10, "Test teklif")),
                ListingOfferResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().status()).isEqualTo(OfferStatus.PENDING);
        return response.getBody();
    }

    private ListingOfferResponse acceptOffer(String sellerToken, Long offerId) {
        ResponseEntity<ListingOfferResponse> response = rest.postForEntity(
                "/api/seller/listing-offers/" + offerId + "/accept",
                bearerEntity(sellerToken),
                ListingOfferResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        return response.getBody();
    }
}
