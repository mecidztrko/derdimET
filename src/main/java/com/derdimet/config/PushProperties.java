package com.derdimet.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "derdimet.push")
public class PushProperties {

    private boolean enabled = false;

    /** Firebase Cloud Messaging legacy server key (opsiyonel). */
    private String fcmServerKey = "";
}
