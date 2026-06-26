package com.derdimet.validation;

import com.derdimet.security.PasswordPolicyService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordConstraintValidator implements ConstraintValidator<ValidPassword, String> {

    private final PasswordPolicyService passwordPolicyService = new PasswordPolicyService();

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
        return passwordPolicyService.isValid(value);
    }
}
