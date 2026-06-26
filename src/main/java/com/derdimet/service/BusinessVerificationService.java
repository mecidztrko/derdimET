package com.derdimet.service;

import com.derdimet.api.AdminBusinessVerificationResponse;
import com.derdimet.api.SubmitBusinessVerificationRequest;
import com.derdimet.entity.AccountType;
import com.derdimet.entity.BusinessVerificationStatus;
import com.derdimet.entity.User;
import com.derdimet.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class BusinessVerificationService {

    private final UserRepository userRepository;

    @Transactional
    public AdminBusinessVerificationResponse submit(User user, SubmitBusinessVerificationRequest body) {
        if (user.getAccountType() != AccountType.BUSINESS) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Yalnızca kurumsal hesaplar belge gönderebilir");
        }
        if (user.getBusinessVerificationStatus() == BusinessVerificationStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Başvurunuz zaten inceleniyor");
        }
        user.setBusinessDocumentUrl(body.documentUrl().trim());
        user.setBusinessVerificationStatus(BusinessVerificationStatus.PENDING);
        user.setBusinessVerificationNote(null);
        user.setBusinessVerified(false);
        return AdminBusinessVerificationResponse.fromEntity(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public List<AdminBusinessVerificationResponse> listPending() {
        return userRepository.findByBusinessVerificationStatusOrderByCreatedAtDesc(BusinessVerificationStatus.PENDING)
                .stream()
                .map(AdminBusinessVerificationResponse::fromEntity)
                .toList();
    }

    @Transactional
    public AdminBusinessVerificationResponse approve(Long userId) {
        User user = requirePending(userId);
        user.setBusinessVerificationStatus(BusinessVerificationStatus.APPROVED);
        user.setBusinessVerified(true);
        user.setBusinessVerificationNote(null);
        return AdminBusinessVerificationResponse.fromEntity(userRepository.save(user));
    }

    @Transactional
    public AdminBusinessVerificationResponse reject(Long userId, String note) {
        User user = requirePending(userId);
        user.setBusinessVerificationStatus(BusinessVerificationStatus.REJECTED);
        user.setBusinessVerified(false);
        user.setBusinessVerificationNote(note);
        return AdminBusinessVerificationResponse.fromEntity(userRepository.save(user));
    }

    private User requirePending(Long userId) {
        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kullanıcı bulunamadı"));
        if (user.getBusinessVerificationStatus() != BusinessVerificationStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bekleyen başvuru yok");
        }
        return user;
    }
}
