// Sends transactional emails (verification codes) via the Resend HTTP API
package com.dishcision.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class EmailService {

    private final RestClient resend;
    private final String fromEmail;

    public EmailService(@Value("${resend.api-key}") String apiKey,
            @Value("${resend.from}") String fromEmail) {
        this.fromEmail = fromEmail;
        this.resend = RestClient.builder()
                .baseUrl("https://api.resend.com")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
    }

    @Async
    public void sendVerificationCode(String toEmail, String code) {
        log.info("Sending verification code to: {}", toEmail);
        try {
            Map<String, Object> payload = Map.of(
                    "from", fromEmail,
                    "to", List.of(toEmail),
                    "subject", "Your Dishcision verification code",
                    "html", "<p>Your verification code is <strong>" + code
                            + "</strong>. It expires in 10 minutes.</p>");
            resend.post()
                    .uri("/emails")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();
            log.info("Verification email sent to {}", toEmail);
        } catch (RestClientResponseException e) {
            // Resend returned an error
            log.error("Resend error sending to {}: {} — {}", toEmail, e.getStatusCode(), e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Failed to send verification email to {}: {}", toEmail, e.getMessage());
        }
    }
}
