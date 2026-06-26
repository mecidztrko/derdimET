package com.derdimet;

import static org.assertj.core.api.Assertions.assertThat;

import com.derdimet.api.ChatMessageResponse;
import com.derdimet.api.ConversationItemResponse;
import com.derdimet.api.CreateMessageRequest;
import com.derdimet.entity.UserRole;
import com.derdimet.support.AbstractApiIntegrationTest;
import com.derdimet.support.TestUserFactory;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

class MessagingIntegrationTest extends AbstractApiIntegrationTest {

    @Test
    void usersCanOpenConversationAndSendMessage() {
        TestUserFactory.TestUser buyer = users.verified(UserRole.MEAT_BUYER);
        TestUserFactory.TestUser slaughterhouse = users.verified(UserRole.SLAUGHTERHOUSE);
        String buyerToken = login(buyer);

        ResponseEntity<ConversationItemResponse> conversationResponse = rest.postForEntity(
                "/api/conversations/with/" + slaughterhouse.entity().getId(),
                bearerEntity(buyerToken),
                ConversationItemResponse.class);

        assertThat(conversationResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(conversationResponse.getBody()).isNotNull();
        Long conversationId = conversationResponse.getBody().conversationId();

        ResponseEntity<ChatMessageResponse> messageResponse = rest.postForEntity(
                "/api/conversations/" + conversationId + "/messages",
                bearerEntity(buyerToken, new CreateMessageRequest("Merhaba, teklif hakkında konuşalım.")),
                ChatMessageResponse.class);

        assertThat(messageResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(messageResponse.getBody()).isNotNull();
        assertThat(messageResponse.getBody().text()).isEqualTo("Merhaba, teklif hakkında konuşalım.");
        assertThat(messageResponse.getBody().senderId()).isEqualTo(buyer.entity().getId());

        ResponseEntity<List<ChatMessageResponse>> messagesResponse = rest.exchange(
                "/api/conversations/" + conversationId + "/messages",
                HttpMethod.GET,
                bearerEntity(buyerToken),
                new ParameterizedTypeReference<>() {});

        assertThat(messagesResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(messagesResponse.getBody()).hasSize(1);
        assertThat(messagesResponse.getBody().get(0).text()).contains("teklif");
    }

    @Test
    void conversationAppearsInInbox() {
        TestUserFactory.TestUser seller = users.verified(UserRole.ANIMAL_SELLER);
        TestUserFactory.TestUser slaughterhouse = users.verified(UserRole.SLAUGHTERHOUSE);
        String sellerToken = login(seller);

        rest.postForEntity(
                "/api/conversations/with/" + slaughterhouse.entity().getId(),
                bearerEntity(sellerToken),
                ConversationItemResponse.class);

        ResponseEntity<List<ConversationItemResponse>> inbox = rest.exchange(
                "/api/conversations",
                HttpMethod.GET,
                bearerEntity(sellerToken),
                new ParameterizedTypeReference<>() {});

        assertThat(inbox.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(inbox.getBody()).isNotEmpty();
        assertThat(inbox.getBody()).extracting(ConversationItemResponse::otherUserId)
                .contains(slaughterhouse.entity().getId());
    }

    @Test
    void messagingRequiresAuthentication() {
        ResponseEntity<String> response = rest.getForEntity("/api/conversations", String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }
}
