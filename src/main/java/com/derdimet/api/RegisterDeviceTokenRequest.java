package com.derdimet.api;

import com.derdimet.entity.DevicePlatform;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterDeviceTokenRequest(@NotBlank String token, @NotNull DevicePlatform platform) {}
