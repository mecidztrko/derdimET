package com.derdimet.service;

import com.derdimet.api.ConversationItemResponse;
import com.derdimet.api.CreateMessageRequest;
import com.derdimet.api.ChatMessageResponse;
import com.derdimet.entity.Conversation;
import com.derdimet.entity.Message;
import com.derdimet.entity.User;
import com.derdimet.repository.ConversationRepository;
import com.derdimet.repository.MessageRepository;
import com.derdimet.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class MessagingService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final AccountGuardService accountGuard;
    private final PushNotificationService pushNotificationService;

    @Transactional(readOnly = true)
    public List<ConversationItemResponse> listConversations(User current) {
        return conversationRepository.findByUser1_IdOrUser2_IdOrderByLastMessageAtDesc(current.getId(), current.getId()).stream()
                .map(
                        c ->
                                ConversationItemResponse.fromEntity(
                                        c,
                                        current.getId(),
                                        (int)
                                                messageRepository.countByConversation_IdAndSender_IdNotAndReadAtIsNull(
                                                        c.getId(), current.getId())))
                .toList();
    }

    @Transactional
    public ConversationItemResponse getOrCreateConversation(User current, Long otherUserId) {
        accountGuard.requireEmailVerified(current);
        if (current.getId().equals(otherUserId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Kendinizle sohbet başlatamazsınız");
        }
        User other =
                userRepository
                        .findById(otherUserId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kullanıcı bulunamadı"));

        Long a = Math.min(current.getId(), other.getId());
        Long b = Math.max(current.getId(), other.getId());

        Conversation c =
                conversationRepository
                        .findByUser1_IdAndUser2_Id(a, b)
                        .orElseGet(() -> {
                            Conversation n = new Conversation();
                            if (current.getId().equals(a)) {
                                n.setUser1(current);
                                n.setUser2(other);
                            } else {
                                n.setUser1(other);
                                n.setUser2(current);
                            }
                            n.setLastMessageAt(LocalDateTime.now());
                            return conversationRepository.save(n);
                        });
        return ConversationItemResponse.fromEntity(c, current.getId(), 0);
    }

    @Transactional
    public List<ChatMessageResponse> listMessages(User current, Long conversationId) {
        Conversation c =
                conversationRepository
                        .findById(conversationId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sohbet bulunamadı"));
        assertMember(current, c);
        messageRepository.markAsReadForRecipient(conversationId, current.getId(), LocalDateTime.now());
        return messageRepository.findByConversation_IdOrderByCreatedAtAsc(conversationId).stream()
                .map(ChatMessageResponse::fromEntity)
                .toList();
    }

    @Transactional
    public ChatMessageResponse sendMessage(User current, Long conversationId, CreateMessageRequest body) {
        accountGuard.requireEmailVerified(current);
        Conversation c =
                conversationRepository
                        .findById(conversationId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sohbet bulunamadı"));
        assertMember(current, c);

        Message m = new Message();
        m.setConversation(c);
        m.setSender(current);
        m.setText(body.text().trim());
        Message saved = messageRepository.save(m);

        c.setLastMessageAt(saved.getCreatedAt() != null ? saved.getCreatedAt() : LocalDateTime.now());
        conversationRepository.save(c);

        User recipient = otherParticipant(current, c);
        if (recipient != null) {
            pushNotificationService.notifyMessage(
                    recipient, "Yeni mesaj", current.getName() + ": " + saved.getText());
        }

        return ChatMessageResponse.fromEntity(saved);
    }

    private static User otherParticipant(User current, Conversation c) {
        if (c.getUser1() != null && !c.getUser1().getId().equals(current.getId())) {
            return c.getUser1();
        }
        return c.getUser2();
    }

    private static void assertMember(User current, Conversation c) {
        Long me = current.getId();
        Long u1 = c.getUser1() != null ? c.getUser1().getId() : null;
        Long u2 = c.getUser2() != null ? c.getUser2().getId() : null;
        if (me == null || (!me.equals(u1) && !me.equals(u2))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bu sohbet için yetkiniz yok");
        }
    }
}

