package com.derdimet.service;

import com.derdimet.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AccountGuardService {

    public void requireEmailVerified(User user) {
        if (user == null || !user.isEmailVerified()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Bu işlem için önce e-posta adresinizi doğrulamanız gerekir");
        }
    }
}
