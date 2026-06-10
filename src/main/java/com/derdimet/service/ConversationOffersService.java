package com.derdimet.service;

import com.derdimet.api.ConversationOfferResponse;
import com.derdimet.entity.Conversation;
import com.derdimet.entity.User;
import com.derdimet.repository.AnimalOfferRepository;
import com.derdimet.repository.ConversationRepository;
import com.derdimet.repository.MeatOfferRepository;
import com.derdimet.repository.SlaughterhouseListingOfferRepository;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ConversationOffersService {

    private final ConversationRepository conversationRepository;
    private final SlaughterhouseListingOfferRepository listingOfferRepository;
    private final AnimalOfferRepository animalOfferRepository;
    private final MeatOfferRepository meatOfferRepository;

    @Transactional(readOnly = true)
    public List<ConversationOfferResponse> listForConversation(User current, Long conversationId) {
        Conversation c =
                conversationRepository
                        .findById(conversationId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sohbet bulunamadı"));
        Long otherUserId = otherUserId(current, c);
        if (otherUserId == null) {
            return List.of();
        }

        Long me = current.getId();
        List<ConversationOfferResponse> offers = new ArrayList<>();

        listingOfferRepository.findBetweenUsers(me, otherUserId).stream()
                .map(o -> ConversationOfferResponse.fromListing(o, me))
                .forEach(offers::add);

        animalOfferRepository.findBetweenUsers(me, otherUserId).stream()
                .map(o -> ConversationOfferResponse.fromAnimal(o, me))
                .forEach(offers::add);

        meatOfferRepository.findBetweenUsers(me, otherUserId).stream()
                .map(o -> ConversationOfferResponse.fromMeat(o, me))
                .forEach(offers::add);

        offers.sort(
                Comparator.comparing(
                                ConversationOfferResponse::createdAt,
                                Comparator.nullsLast(Comparator.reverseOrder()))
                        .thenComparing(ConversationOfferResponse::offerId, Comparator.nullsLast(Comparator.reverseOrder())));

        return offers;
    }

    private static Long otherUserId(User current, Conversation c) {
        Long me = current.getId();
        Long u1 = c.getUser1() != null ? c.getUser1().getId() : null;
        Long u2 = c.getUser2() != null ? c.getUser2().getId() : null;
        if (me == null || (!me.equals(u1) && !me.equals(u2))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bu sohbet için yetkiniz yok");
        }
        if (me.equals(u1)) {
            return u2;
        }
        return u1;
    }
}
