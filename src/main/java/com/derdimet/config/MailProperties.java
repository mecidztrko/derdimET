package com.derdimet.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "derdimet.mail")
public class MailProperties {

    /** false ise e-postalar yalnızca loga yazılır (yerel geliştirme). */
    private boolean enabled = false;

    private String from = "noreply@derdimet.local";

    private String fromName = "derdimET";
}
