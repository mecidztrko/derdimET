package com.derdimet.service;

import com.derdimet.config.MediaProperties;
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
        if (Arrays.stream(mediaProperties.getAllowedMimeTypes()).noneMatch(m -> m.equalsIgnoreCase(contentType))) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Desteklenmeyen dosya türü");
        }
        String ext = extensionFromContentType(contentType, file.getOriginalFilename());
        String filename = UUID.randomUUID().toString().replace("-", "") + ext;

        Path baseDir = Paths.get(mediaProperties.getUploadDir()).toAbsolutePath().normalize();
        try {
            Files.createDirectories(baseDir);
            Path dest = baseDir.resolve(filename).normalize();
            if (!dest.startsWith(baseDir)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Geçersiz dosya yolu");
            }
            Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Yükleme başarısız", ex);
        }

        String prefix = mediaProperties.getPublicUrlPrefix();
        if (!prefix.endsWith("/")) {
            prefix = prefix + "/";
        }
        return prefix + filename;
    }

    private static String extensionFromContentType(String contentType, String originalFilename) {
        return switch (contentType) {
            case "image/jpeg", "image/jpg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> {
                if (originalFilename != null) {
                    int idx = originalFilename.lastIndexOf('.');
                    if (idx > 0 && idx < originalFilename.length() - 1) {
                        yield originalFilename.substring(idx).toLowerCase(Locale.ROOT);
                    }
                }
                yield ".bin";
            }
        };
    }
}
