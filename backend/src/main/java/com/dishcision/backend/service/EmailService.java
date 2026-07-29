// This service sends transactional emails (verification codes) via Gmail SMTP
// Use Resend API to scale up during production
package com.dishcision.backend.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    // Gmail requires the "from" address to match the authenticated account
    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendVerificationCode(String toEmail, String code) {
        log.info("Sending verification code to: {}", toEmail);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Your Dishcision verification code");
            helper.setText("<p>Your verification code is <strong>" + code
                    + "</strong>. It expires in 10 minutes.</p>", true);
            mailSender.send(message);
        } catch (Exception e) {
            // Don't let an email provider outage block registration entirely —
            // the user can still request a resend once the issue clears.
            log.error("Failed to send verification email to {}: {}", toEmail, e.getMessage());
        }
    }
}
