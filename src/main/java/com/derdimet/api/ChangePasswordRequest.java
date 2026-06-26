package com.derdimet.api;

import com.derdimet.validation.ValidPassword;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @NotBlank String currentPassword, @NotBlank @ValidPassword @Size(max = 128) String newPassword) {}
