package com.thrddqno.ledgerlyapi.common.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "security.jwt")
public class TokenProperties {

    private String accessTokenCookieName = "access_token";
    private String refreshTokenCookieName = "refresh_token";

    private long accessTokenExpiry = 15 * 60 * 1000; // 15 minutes
    private long refreshTokenExpiry = 7 * 24 * 60 * 60 * 1000; // 7 days
}