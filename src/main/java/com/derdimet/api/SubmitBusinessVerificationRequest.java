package com.derdimet.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SubmitBusinessVerificationRequest(@NotBlank @Size(max = 1024) String documentUrl) {}
