package com.derdimet.api;

import com.derdimet.entity.AuditAction;
import java.time.LocalDateTime;

public record AuditEventResponse(
        Long id,
        Long actorUserId,
        String actorEmail,
        AuditAction action,
        String resourceType,
        Long resourceId,
        String details,
        String ipAddress,
        LocalDateTime createdAt) {}
