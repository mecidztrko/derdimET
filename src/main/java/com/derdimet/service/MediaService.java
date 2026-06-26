package com.derdimet.service;

import com.derdimet.config.MediaProperties;
import com.derdimet.security.ImageContentValidator;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Locale;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final MediaProperties mediaProperties;

    /** Tek bir görseli kaydeder, public URL'i döner (örn. /uploads/abc.jpg). */
    public String saveImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dosya boş");
        }
        if (file.getSize() > mediaProperties.getMaxFileSize()) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "Dosya çok büyük");
        }
        String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase(Locale.ROOT);
        if (Arrays.stream(mediaProperties.getAllowedMimeTypes())
                .noneMatch(m -> ImageContentValidator.normalizeMime(m)
                        .equals(ImageContentValidator.normalizeMime(contentType)))) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Desteklenmeyen dosya türü");
        }

        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dosya okunamadı", ex);
        }
        if (!ImageContentValidator.matchesDeclaredMime(bytes, contentType)) {
            throw new ResponseStatusException(
                    HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Dosya içeriği bildirilen türle eşleşmiyor");
        }

        String ext = extensionFromContentType(ImageContentValidator.normalizeMime(contentType));
        String filename = UUID.randomUUID().toString().replace("-", "") + ext;

        Path baseDir = Paths.get(mediaProperties.getUploadDir()).toAbsolutePath().normalize();
        try {
            Files.createDirectories(baseDir);
            Path dest = baseDir.resolve(filename).normalize();
            if (!dest.startsWith(baseDir)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Geçersiz dosya yolu");
            }
            Files.write(dest, bytes);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Yükleme başarısız", ex);
        }

        String prefix = mediaProperties.getPublicUrlPrefix();
        if (!prefix.endsWith("/")) {
            prefix = prefix + "/";
        }
        return prefix + filename;
    }

    private static String extensionFromContentType(String contentType) {
        return switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Desteklenmeyen dosya türü");
        };
    }
}
