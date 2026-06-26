package com.derdimet.service;

import com.derdimet.config.MailProperties;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final MailProperties mailProperties;
    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    public void sendCode(String toEmail, String subject, String body) {
        if (!mailProperties.isEnabled()) {
            log.info("[Mail disabled] To={} Subject={} Body={}", toEmail, subject, body);
            return;
        }
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            log.warn("[Mail unavailable] To={} Subject={} Body={}", toEmail, subject, body);
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setTo(toEmail);
            helper.setFrom(mailProperties.getFrom(), mailProperties.getFromName());
            helper.setSubject(subject);
            helper.setText(body, false);
            mailSender.send(message);
            log.info("E-posta gönderildi: to={} subject={}", toEmail, subject);
        } catch (MessagingException | java.io.UnsupportedEncodingException ex) {
            log.error("E-posta gönderilemedi: to={}", toEmail, ex);
            throw new IllegalStateException("E-posta gönderilemedi", ex);
        }
    }
}
