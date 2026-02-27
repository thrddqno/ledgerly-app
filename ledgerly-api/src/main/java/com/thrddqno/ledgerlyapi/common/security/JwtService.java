package com.thrddqno.ledgerlyapi.common.security;

import com.thrddqno.ledgerlyapi.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    @Value("${JWT_SECRET_KEY}")
    private String SECRET_KEY;

    public SecretKey getSigningKey(){
        byte[] keyByte = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyByte);
    }

    public Claims extractClaims(String token) {
        return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractClaims(token);
        return claimsResolver.apply(claims);
    }

    public String extract(String claim, String token){
        return extractClaim(token, claims -> claims.get(claim, String.class));
    }

    public String extractSubject(String token){
        return extractClaim(token, Claims::getSubject);
    }

    public String generateToken(Map<String, Object> extraClaims, User user){
        extraClaims.put("email", user.getEmail());
        extraClaims.put("role", user.getRole());
        //temporarily set the exp of the token to 7 days (1 week) for development purposes.
        // TODO: implement refresh token after finalizing the backend and about to work for the front-end
        // TODO: implement OAuth 2.0 for this platform
        return Jwts
                .builder()
                .claims(extraClaims)
                .subject(user.getId().toString())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7))
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    public String generateToken(User user){
        return generateToken(new HashMap<>(), user);
    }

    public boolean isTokenValid(String token, UserDetails userDetails){
        final String email = extract("email", token);
        return (email.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    public boolean isTokenExpired(String token){
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

}
