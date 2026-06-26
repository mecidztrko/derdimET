package com.derdimet.api;

import com.derdimet.service.BusinessVerificationService;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/business-verifications")
@RequiredArgsConstructor
public class AdminBusinessVerificationController {

    private final BusinessVerificationService businessVerificationService;

    @GetMapping
    public List<AdminBusinessVerificationResponse> listPending() {
        return businessVerificationService.listPending();
    }

    @PostMapping("/{userId}/approve")
    public ResponseEntity<AdminBusinessVerificationResponse> approve(@PathVariable Long userId) {
        return ResponseEntity.ok(businessVerificationService.approve(userId));
    }

    @PostMapping("/{userId}/reject")
    public ResponseEntity<AdminBusinessVerificationResponse> reject(
            @PathVariable Long userId, @RequestBody(required = false) Map<String, String> body) {
        String note = body != null ? body.get("note") : null;
        return ResponseEntity.ok(businessVerificationService.reject(userId, note));
    }
}
