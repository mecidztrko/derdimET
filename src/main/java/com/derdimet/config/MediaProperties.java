package com.derdimet.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "derdimet.media")
public class MediaProperties {

    /** Yüklenen dosyaların saklanacağı disk konumu. */
    private String uploadDir = "uploads";

    /** Static serve URL prefix'i. */
    private String publicUrlPrefix = "/uploads";

    /** İzin verilen MIME türleri. */
    private String[] allowedMimeTypes = new String[] {"image/jpeg", "image/jpg", "image/png", "image/webp"};

    /** Maks dosya boyutu (byte). */
    private long maxFileSize = 8L * 1024 * 1024;

    public String getUploadDir() {
        return uploadDir;
    }

    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }

    public String getPublicUrlPrefix() {
        return publicUrlPrefix;
    }

    public void setPublicUrlPrefix(String publicUrlPrefix) {
        this.publicUrlPrefix = publicUrlPrefix;
    }

    public String[] getAllowedMimeTypes() {
        return allowedMimeTypes;
    }

    public void setAllowedMimeTypes(String[] allowedMimeTypes) {
        this.allowedMimeTypes = allowedMimeTypes;
    }

    public long getMaxFileSize() {
        return maxFileSize;
    }

    public void setMaxFileSize(long maxFileSize) {
        this.maxFileSize = maxFileSize;
    }
}
