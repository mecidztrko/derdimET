package com.derdimet.config;

import java.util.Arrays;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@ConfigurationProperties(prefix = "derdimet.cors")
public class CorsProperties {

    /** Virgülle ayrılmış origin pattern listesi; boşsa CORS devre dışı kalır. */
    private String allowedOriginPatterns = "";

    public String getAllowedOriginPatterns() {
        return allowedOriginPatterns;
    }

    public void setAllowedOriginPatterns(String allowedOriginPatterns) {
        this.allowedOriginPatterns = allowedOriginPatterns;
    }

    public List<String> resolvedPatterns() {
        if (!StringUtils.hasText(allowedOriginPatterns)) {
            return List.of();
        }
        return Arrays.stream(allowedOriginPatterns.split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .toList();
    }
}
