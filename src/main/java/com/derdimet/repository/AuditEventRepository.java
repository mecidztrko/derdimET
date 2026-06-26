package com.derdimet.repository;

import com.derdimet.entity.AuditEvent;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditEventRepository extends JpaRepository<AuditEvent, Long> {

    List<AuditEvent> findTop100ByOrderByCreatedAtDesc();
}
