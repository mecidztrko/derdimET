package com.derdimet.api;

import com.derdimet.entity.User;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.AccountGuardService;
import com.derdimet.service.MediaService;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;
    private final UserRepository userRepository;
    private final AccountGuardService accountGuard;

    public record UploadedImageResponse(String url) {}

    public record UploadedImagesResponse(List<String> urls) {}

    /** İlan görselleri — e-posta doğrulaması gerekir. */
    @PostMapping(value = "/images", consumes = "multipart/form-data")
    public ResponseEntity<UploadedImageResponse> uploadOne(
            @AuthenticationPrincipal UserDetails principal, @RequestParam("file") MultipartFile file) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        accountGuard.requireEmailVerified(user);
        String url = mediaService.saveImage(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(new UploadedImageResponse(url));
    }

    @PostMapping(value = "/images/batch", consumes = "multipart/form-data")
    public ResponseEntity<UploadedImagesResponse> uploadBatch(
            @AuthenticationPrincipal UserDetails principal, @RequestParam("files") List<MultipartFile> files) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        accountGuard.requireEmailVerified(user);
        List<String> urls = new ArrayList<>();
        for (MultipartFile f : files) {
            urls.add(mediaService.saveImage(f));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(new UploadedImagesResponse(urls));
    }

    /** Profil fotoğrafı — doğrulama gerekmez. */
    @PostMapping(value = "/profile-image", consumes = "multipart/form-data")
    public ResponseEntity<UploadedImageResponse> uploadProfileImage(
            @AuthenticationPrincipal UserDetails principal, @RequestParam("file") MultipartFile file) {
        userRepository.findByEmail(principal.getUsername()).orElseThrow();
        String url = mediaService.saveImage(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(new UploadedImageResponse(url));
    }
}
