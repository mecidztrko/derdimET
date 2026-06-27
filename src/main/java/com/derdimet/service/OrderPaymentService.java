package com.derdimet.service;

import com.derdimet.api.BuyerPurchaseItemResponse;
import com.derdimet.entity.NotificationType;
import com.derdimet.entity.Order;
import com.derdimet.entity.OrderStatus;
import com.derdimet.entity.User;
import com.derdimet.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class OrderPaymentService {

    private final OrderRepository orderRepository;
    private final TransactionService transactionService;
    private final InboxNotificationService inboxNotificationService;

    @Transactional
    public BuyerPurchaseItemResponse confirmMockPayment(User buyer, Long orderId) {
        Order order = requireBuyerOrder(buyer, orderId);
        if (order.getStatus() != OrderStatus.PAYMENT_PENDING && order.getStatus() != OrderStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bu sipariş ödeme beklemiyor");
        }
        order.setStatus(OrderStatus.PAYMENT_CONFIRMED);
        orderRepository.save(order);
        var sh = order.getMeatOffer().getSaleRequest().getSlaughterhouse();
        inboxNotificationService.create(
                sh,
                NotificationType.PAYMENT,
                "Ödeme onaylandı",
                buyer.getName() + " ödemeyi tamamladı (mock).",
                "/slaughterhouse/sell-meat");
        return BuyerPurchaseItemResponse.fromEntity(order);
    }

    @Transactional
    public BuyerPurchaseItemResponse completeOrder(User buyer, Long orderId) {
        Order order = requireBuyerOrder(buyer, orderId);
        if (order.getStatus() != OrderStatus.PAYMENT_CONFIRMED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Önce ödeme onaylanmalı");
        }
        order.setStatus(OrderStatus.COMPLETED);
        orderRepository.save(order);
        transactionService.recordCompletedOrder(order);
        return BuyerPurchaseItemResponse.fromEntity(order);
    }

    private Order requireBuyerOrder(User buyer, Long orderId) {
        return orderRepository.findByIdAndBuyer_Id(orderId, buyer.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sipariş bulunamadı"));
    }
}
