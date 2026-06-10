package com.derdimet.api;

import com.derdimet.entity.User;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.ConversationOffersService;
import com.derdimet.service.MessagingService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MessagingController {

    private final UserRepository userRepository;
    private final MessagingService messagingService;
    private final ConversationOffersService conversationOffersService;

    @GetMapping("/conversations")
    public List<ConversationItemResponse> listConversations(@AuthenticationPrincipal UserDetails principal) {
        User current = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return messagingService.listConversations(current);
    }

    @PostMapping("/conversations/with/{userId}")
    public ResponseEntity<ConversationItemResponse> getOrCreate(@AuthenticationPrincipal UserDetails principal, @PathVariable Long userId) {
        User current = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.status(HttpStatus.OK).body(messagingService.getOrCreateConversation(current, userId));
    }

    @GetMapping("/conversations/{conversationId}/offers")
    public List<ConversationOfferResponse> listConversationOffers(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long conversationId) {
        User current = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return conversationOffersService.listForConversation(current, conversationId);
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public List<ChatMessageResponse> listMessages(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long conversationId) {
        User current = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return messagingService.listMessages(current, conversationId);
    }

    @PostMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<ChatMessageResponse> sendMessage(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long conversationId,
            @Valid @RequestBody CreateMessageRequest body) {
        User current = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.status(HttpStatus.CREATED).body(messagingService.sendMessage(current, conversationId, body));
    }
}

