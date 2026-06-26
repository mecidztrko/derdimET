package com.derdimet.api;

import com.derdimet.entity.AccountType;
import com.derdimet.entity.UserRole;
import com.derdimet.validation.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Email @Size(max = 255) String email,
        @NotBlank @ValidPassword @Size(max = 128) String password,
        @NotBlank @Size(max = 200) String name,
        @Size(max = 50) String phone,
        @NotNull UserRole role,
        @NotNull AccountType accountType,
        @Size(max = 300) String companyName,
        @Size(max = 50) String taxNumber,
        @Size(max = 500) String addressLine,
        @Size(max = 120) String city) {}
