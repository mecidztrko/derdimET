package com.derdimet.api;

import com.derdimet.entity.AuditEvent;
import com.derdimet.service.AuditService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/audit-events")
@RequiredArgsConstructor
public class AdminAuditController {

    private final AuditService auditService;

    @GetMapping
    public List<AuditEventResponse> list(@RequestParam(defaultValue = "50") int limit) {
        return auditService.recent(limit).stream().map(AdminAuditController::toResponse).toList();
    }

    private static AuditEventResponse toResponse(AuditEvent event) {
        return new AuditEventResponse(
                event.getId(),
                event.getActorUserId(),
                event.getActorEmail(),
                event.getAction(),
                event.getResourceType(),
                event.getResourceId(),
                event.getDetails(),
                event.getIpAddress(),
                event.getCreatedAt());
    }
}
