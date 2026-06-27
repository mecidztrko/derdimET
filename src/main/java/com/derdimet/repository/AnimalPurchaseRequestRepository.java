package com.derdimet.repository;

import com.derdimet.entity.AnimalPurchaseRequest;
import com.derdimet.entity.RequestStatus;
import com.derdimet.entity.User;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AnimalPurchaseRequestRepository extends JpaRepository<AnimalPurchaseRequest, Long>, JpaSpecificationExecutor<AnimalPurchaseRequest> {

    List<AnimalPurchaseRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);

    List<AnimalPurchaseRequest> findByCreatedByOrderByCreatedAtDesc(User createdBy);

    Optional<AnimalPurchaseRequest> findByIdAndCreatedBy_Id(Long id, Long createdById);

    List<AnimalPurchaseRequest> findByStatusAndExpiresAtBefore(RequestStatus status, LocalDateTime before);
}
