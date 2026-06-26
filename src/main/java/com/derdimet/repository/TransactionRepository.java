package com.derdimet.repository;

import com.derdimet.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    boolean existsByOrder_Id(Long orderId);
}
