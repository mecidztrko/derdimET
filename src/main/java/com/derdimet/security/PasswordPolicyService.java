package com.derdimet.security;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PasswordPolicyService {

    public static final String POLICY_MESSAGE =
            "Şifre en az 8 karakter olmalı; büyük harf, küçük harf, rakam ve özel karakter içermelidir.";

    public void validate(String password) {
        if (!isValid(password)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, POLICY_MESSAGE);
        }
    }

    public boolean isValid(String password) {
        if (password == null || password.length() < 8 || password.length() > 128) {
            return false;
        }
        boolean upper = false;
        boolean lower = false;
        boolean digit = false;
        boolean special = false;
        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) {
                upper = true;
            } else if (Character.isLowerCase(c)) {
                lower = true;
            } else if (Character.isDigit(c)) {
                digit = true;
            } else {
                special = true;
            }
        }
        return upper && lower && digit && special;
    }
}
