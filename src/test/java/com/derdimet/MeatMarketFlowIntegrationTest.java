package com.derdimet;

import static org.assertj.core.api.Assertions.assertThat;

import com.derdimet.api.CreateMeatOfferRequest;
import com.derdimet.api.CreateMeatSaleRequest;
import com.derdimet.api.MeatOfferItemResponse;
import com.derdimet.api.MeatSaleRequestResponse;
import com.derdimet.api.SlaughterhouseMeatOfferResponse;
import com.derdimet.entity.AnimalCategory;
import com.derdimet.entity.OfferStatus;
import com.derdimet.entity.OrderStatus;
import com.derdimet.entity.UserRole;
import com.derdimet.repository.OrderRepository;
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

class MeatMarketFlowIntegrationTest extends AbstractApiIntegrationTest {

    @Autowired
    private OrderRepository orderRepository;

    @Test
    void meatOfferAcceptCreatesOrder() {
        TestUserFactory.TestUser slaughterhouse = users.verified(UserRole.SLAUGHTERHOUSE);
        TestUserFactory.TestUser buyer = users.verified(UserRole.MEAT_BUYER);
        String slaughterhouseToken = login(slaughterhouse);
        String buyerToken = login(buyer);

        MeatSaleRequestResponse listing = createMeatListing(slaughterhouseToken);
        MeatOfferItemResponse offer = createMeatOffer(buyerToken, listing.id());
        SlaughterhouseMeatOfferResponse accepted = acceptMeatOffer(slaughterhouseToken, offer.offerId());

        assertThat(accepted.status()).isEqualTo(OfferStatus.ACCEPTED);
        assertThat(orderRepository.existsByMeatOffer_Id(offer.offerId())).isTrue();
        assertThat(orderRepository.findAll().stream()
                        .filter(o -> o.getMeatOffer().getId().equals(offer.offerId()))
                        .findFirst()
                        .orElseThrow()
                        .getStatus())
                .isEqualTo(OrderStatus.PAYMENT_PENDING);
    }

    @Test
    void buyerCanListOpenMeatSaleRequests() {
        TestUserFactory.TestUser slaughterhouse = users.verified(UserRole.SLAUGHTERHOUSE);
        TestUserFactory.TestUser buyer = users.verified(UserRole.MEAT_BUYER);
        MeatSaleRequestResponse listing = createMeatListing(login(slaughterhouse));

        ResponseEntity<List<MeatSaleRequestResponse>> response = rest.exchange(
                "/api/buyer/meat-sale-requests",
                HttpMethod.GET,
                bearerEntity(login(buyer)),
                new ParameterizedTypeReference<>() {});

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).extracting(MeatSaleRequestResponse::id).contains(listing.id());
    }

    private MeatSaleRequestResponse createMeatListing(String slaughterhouseToken) {
        ResponseEntity<MeatSaleRequestResponse> response = rest.postForEntity(
                "/api/slaughterhouse/meat-sale-requests",
                bearerEntity(
                        slaughterhouseToken,
                        new CreateMeatSaleRequest(
                                "Dana kıyma",
                                "Dana",
                                AnimalCategory.BUYUKBAS,
                                "Kıyma",
                                new BigDecimal("120.0"),
                                new BigDecimal("420.00"),
                                "Vakum",
                                "Ankara",
                                "Test et ilanı",
                                List.of(),
                                null)),
                MeatSaleRequestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        return response.getBody();
    }

    private MeatOfferItemResponse createMeatOffer(String buyerToken, Long saleRequestId) {
        ResponseEntity<MeatOfferItemResponse> response = rest.postForEntity(
                "/api/buyer/meat-sale-requests/" + saleRequestId + "/offers",
                bearerEntity(
                        buyerToken,
                        new CreateMeatOfferRequest(new BigDecimal("415.00"), new BigDecimal("50.0"), "Test et teklifi")),
                MeatOfferItemResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().status()).isEqualTo(OfferStatus.PENDING);
        return response.getBody();
    }

    private SlaughterhouseMeatOfferResponse acceptMeatOffer(String slaughterhouseToken, Long offerId) {
        ResponseEntity<SlaughterhouseMeatOfferResponse> response = rest.postForEntity(
                "/api/slaughterhouse/meat-offers/" + offerId + "/accept",
                bearerEntity(slaughterhouseToken),
                SlaughterhouseMeatOfferResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        return response.getBody();
    }
}
