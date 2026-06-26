package com.derdimet.service;

import com.derdimet.entity.AuditAction;
import com.derdimet.entity.AuditEvent;
import com.derdimet.entity.User;
import com.derdimet.repository.AuditEventRepository;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditEventRepository auditEventRepository;

    @Transactional
    public void log(User actor, AuditAction action, String resourceType, Long resourceId, String details) {
        AuditEvent event = new AuditEvent();
        if (actor != null) {
            event.setActorUserId(actor.getId());
            event.setActorEmail(actor.getEmail());
        }
        event.setAction(action);
        event.setResourceType(resourceType);
        event.setResourceId(resourceId);
        event.setDetails(details);
        event.setIpAddress(resolveClientIp());
        auditEventRepository.save(event);
        log.info(
                "AUDIT action={} actor={} resource={}#{} details={}",
                action,
                actor != null ? actor.getEmail() : "-",
                resourceType,
                resourceId,
                details);
    }

    @Transactional
    public void logAuthEvent(String email, AuditAction action, String details) {
        AuditEvent event = new AuditEvent();
        event.setActorEmail(email);
        event.setAction(action);
        event.setDetails(details);
        event.setIpAddress(resolveClientIp());
        auditEventRepository.save(event);
        log.info("AUDIT action={} email={} details={}", action, email, details);
    }

    @Transactional(readOnly = true)
    public List<AuditEvent> recent(int limit) {
        int capped = Math.min(Math.max(limit, 1), 100);
        return auditEventRepository.findTop100ByOrderByCreatedAtDesc().stream().limit(capped).toList();
    }

    private static String resolveClientIp() {
        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) {
            return null;
        }
        HttpServletRequest request = attrs.getRequest();
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
