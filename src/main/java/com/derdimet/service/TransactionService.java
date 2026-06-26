package com.derdimet.service;

import com.derdimet.entity.Order;
import com.derdimet.entity.Transaction;
import com.derdimet.repository.TransactionRepository;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    @Transactional
    public void recordCompletedOrder(Order order) {
        if (order == null || transactionRepository.existsByOrder_Id(order.getId())) {
            return;
        }
        Transaction tx = new Transaction();
        tx.setOrder(order);
        tx.setAmount(order.getTotalPrice());
        tx.setTransactionDate(LocalDateTime.now());
        transactionRepository.save(tx);
    }
}
