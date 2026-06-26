package com.derdimet.api;

import com.derdimet.validation.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PasswordResetRequest(
        @NotBlank @Email String email,
        @NotBlank String code,
        @NotBlank @ValidPassword @Size(max = 128) String newPassword) {}
