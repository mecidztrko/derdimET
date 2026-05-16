package com.derdimet.repository;

import com.derdimet.entity.Order;
import com.derdimet.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {

    boolean existsByMeatOffer_Id(Long meatOfferId);

    @EntityGraph(attributePaths = {"meatOffer", "meatOffer.saleRequest", "meatOffer.saleRequest.slaughterhouse", "buyer"})
    List<Order> findByBuyerOrderByCreatedAtDesc(User buyer);

    @EntityGraph(attributePaths = {"meatOffer", "meatOffer.saleRequest", "meatOffer.saleRequest.slaughterhouse", "buyer"})
    List<Order> findByMeatOffer_SaleRequest_SlaughterhouseOrderByCreatedAtDesc(User slaughterhouse);
}
