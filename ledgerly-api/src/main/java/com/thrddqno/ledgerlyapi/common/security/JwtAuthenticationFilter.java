package com.thrddqno.ledgerlyapi.common.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {


    //Fuckin' do not filter if it's these public paths
    private static final List<String> PUBLIC_PATHS = List.of(
            "/auth/login",
            "/auth/register",
            "/auth/refresh",
            "/v3/api-docs",
            "/swagger-ui"
    );

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return PUBLIC_PATHS.stream().anyMatch(path::startsWith);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var uri = request.getRequestURI();
        logger.info("JwtFilter: {}", uri);
        final String authHeader = request.getHeader("Authorization");

        String token = null;
        String email = null;

        if(authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            logger.debug("Token from Authorization header");
        }

        if(token == null) {
            if (request.getCookies() != null) {
                token = Arrays.stream(request.getCookies())
                        .filter(cookie -> "access_token".equals(cookie.getName()))
                        .map(Cookie::getValue)
                        .findFirst()
                        .orElse(null);

                if (token != null) {
                    logger.debug("Token from access_token cookie");
                }
            }
        }


        if (token == null) {
            logger.warn("No token found in request to {}", uri);
            sendErrorResponse(response, "NO_TOKEN", "Token not provided", HttpStatus.UNAUTHORIZED);
            return;
        }

        try {
            email = jwtService.extract("email", token);
        } catch (Exception e) {
            logger.error("Error extracting token: {}", e.getMessage());
            sendErrorResponse(response, "INVALID_TOKEN", "Token is invalid or malformed", HttpStatus.UNAUTHORIZED);
            return;
        }

        if (email == null) {
            sendErrorResponse(response, "INVALID_TOKEN", "Could not extract email from token", HttpStatus.UNAUTHORIZED);
            return;
        }

        if (SecurityContextHolder.getContext().getAuthentication() == null){
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            if (jwtService.isTokenValid(token, userDetails)) {
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            } else {
                logger.warn("Token invalid or expired for user: {}", email);
                sendErrorResponse(response, "INVALID_TOKEN", "Token is invalid or expired", HttpStatus.UNAUTHORIZED);
                return;
            }
        }

        filterChain.doFilter(request,response);

    }

    private void sendErrorResponse(HttpServletResponse response, String errorCode, String message, HttpStatus status) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json");
        String json = String.format(
                "{\"errorCode\":\"%s\",\"message\":\"%s\",\"status\":%d}",
                errorCode,
                message,
                status.value()
        );
        response.getWriter().write(json);
    }
}


