package com.thrddqno.ledgerlyapi.common.security;

import com.thrddqno.ledgerlyapi.common.config.TokenProperties;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class JwtTokenCookieService {

    private final TokenProperties tokenProperties;

    public Cookie createAccessTokenCookie(String token){
        Cookie cookie = new Cookie(tokenProperties.getAccessTokenCookieName(), token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge((int) (tokenProperties.getAccessTokenExpiry()/1000));
        return cookie;
    }

    public Cookie createRefreshTokenCookie(String token){
        Cookie cookie = new Cookie(tokenProperties.getRefreshTokenCookieName(), token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/auth");
        cookie.setMaxAge((int) (tokenProperties.getRefreshTokenExpiry()/1000));
        return cookie;
    }

    public Cookie nullifyTokenCookie(String cookieName, String path) {
        Cookie cookie = new Cookie(cookieName, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath(path);
        cookie.setMaxAge(0);
        return cookie;
    }

    public String extractRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }

        return Arrays.stream(cookies)
                .filter(cookie -> "refresh_token".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}
