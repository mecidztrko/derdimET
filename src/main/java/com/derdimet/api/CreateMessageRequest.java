package com.derdimet.api;

import jakarta.validation.constraints.NotBlank;

public record CreateMessageRequest(@NotBlank String text) {}

