package com.thrddqno.ledgerlyapi.common.security;

import com.thrddqno.ledgerlyapi.common.security.auth.AuthenticationService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var uri = request.getRequestURI();
        logger.info("JwtFilter: {}", uri);
        final String authHeader = request.getHeader("Authorization");

        String token = null;
        String email = null;

        if(authHeader != null && authHeader.startsWith("Bearer "))  { token =  authHeader.substring(7); logger.debug("Token from Authorization header"); }


        if(token == null && request.getCookies() != null){
            token = Arrays.stream(request.getCookies())
                    .filter(cookie -> "access_token".equals(cookie.getName())) // Match your backend
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);

            if (token != null) {
                logger.debug("Token from access_token cookie");
            } else {
                logger.warn("No access_token cookie found in request to {}", uri);
            }
        }

        if (token != null){
            try {
                email = jwtService.extract("email", token);
            } catch (Exception e){
                logger.error("Error extracting token: " + e.getMessage());
            }
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null){
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
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token invalid or expired");
                return;
            }
        } else if (token == null) {
            logger.debug("No token found in request to {}", uri);
        }

        filterChain.doFilter(request,response);

    }
}
