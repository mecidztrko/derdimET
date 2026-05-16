package com.derdimet.repository;

import com.derdimet.entity.MeatSaleRequest;
import com.derdimet.entity.RequestStatus;
import com.derdimet.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeatSaleRequestRepository extends JpaRepository<MeatSaleRequest, Long> {

    List<MeatSaleRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);

    List<MeatSaleRequest> findBySlaughterhouseAndStatusOrderByCreatedAtDesc(User slaughterhouse, RequestStatus status);

    List<MeatSaleRequest> findBySlaughterhouseOrderByCreatedAtDesc(User slaughterhouse);

    java.util.Optional<MeatSaleRequest> findByIdAndSlaughterhouse_Id(Long id, Long slaughterhouseId);
}

