package com.derdimet.repository;

import com.derdimet.entity.OfferEvent;
import com.derdimet.entity.OfferKind;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OfferEventRepository extends JpaRepository<OfferEvent, Long> {

    List<OfferEvent> findByOfferKindAndOfferIdOrderByCreatedAtAsc(OfferKind offerKind, Long offerId);
}
