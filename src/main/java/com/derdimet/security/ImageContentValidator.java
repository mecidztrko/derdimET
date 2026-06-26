package com.derdimet.security;

import java.util.Locale;
import java.util.Optional;

public final class ImageContentValidator {

    private ImageContentValidator() {}

    public static Optional<String> detectMime(byte[] bytes) {
        if (bytes == null || bytes.length < 3) {
            return Optional.empty();
        }
        if (bytes[0] == (byte) 0xFF && bytes[1] == (byte) 0xD8 && bytes[2] == (byte) 0xFF) {
            return Optional.of("image/jpeg");
        }
        if (bytes.length >= 8
                && bytes[0] == (byte) 0x89
                && bytes[1] == 0x50
                && bytes[2] == 0x4E
                && bytes[3] == 0x47
                && bytes[4] == 0x0D
                && bytes[5] == 0x0A
                && bytes[6] == 0x1A
                && bytes[7] == 0x0A) {
            return Optional.of("image/png");
        }
        if (bytes.length >= 12
                && bytes[0] == 'R'
                && bytes[1] == 'I'
                && bytes[2] == 'F'
                && bytes[3] == 'F'
                && bytes[8] == 'W'
                && bytes[9] == 'E'
                && bytes[10] == 'B'
                && bytes[11] == 'P') {
            return Optional.of("image/webp");
        }
        return Optional.empty();
    }

    public static boolean matchesDeclaredMime(byte[] bytes, String declaredContentType) {
        Optional<String> detected = detectMime(bytes);
        if (detected.isEmpty()) {
            return false;
        }
        return normalizeMime(detected.get()).equals(normalizeMime(declaredContentType));
    }

    public static String normalizeMime(String mime) {
        if (mime == null) {
            return "";
        }
        String normalized = mime.toLowerCase(Locale.ROOT).trim();
        if ("image/jpg".equals(normalized)) {
            return "image/jpeg";
        }
        return normalized;
    }
}
