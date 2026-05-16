package com.derdimet.config;

import java.nio.file.Path;
import java.nio.file.Paths;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final MediaProperties mediaProperties;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadAbs = Paths.get(mediaProperties.getUploadDir()).toAbsolutePath().normalize();
        String location = uploadAbs.toUri().toString();
        String prefix = mediaProperties.getPublicUrlPrefix();
        if (!prefix.endsWith("/")) {
            prefix = prefix + "/";
        }
        registry.addResourceHandler(prefix + "**").addResourceLocations(location);
    }
}
