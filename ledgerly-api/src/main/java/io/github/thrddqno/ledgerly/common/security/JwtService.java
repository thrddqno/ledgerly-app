package io.github.thrddqno.ledgerly.common.security;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.github.thrddqno.ledgerly.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
	
	@Value("${spring.security.jwt.secret}") String secret;
	
	public String extractEmail(String token) {
		return extractClaim(token, claim -> claim.get("email", String.class));
	}
	
	public String extractUserId(String token) {
		return extractClaim(token, Claims::getSubject);
	}
	
	public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = extractAllClaims(token);
		return claimsResolver.apply(claims);
	}
	
	private Claims extractAllClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
	}

	private Key getSigningKey() {
		byte[] keyByte = Decoders.BASE64.decode(secret);
		System.out.println(secret);
		return Keys.hmacShaKeyFor(keyByte);
	}
	
	public String generateToken(Map<String, Object> extraClaims, User user) {
		extraClaims.put("email", user.getEmail());
	    extraClaims.put("role", user.getRole());
	    
		return Jwts
				.builder()
				.setClaims(extraClaims)
				.setSubject(user.getId().toString())
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
				.signWith(getSigningKey(), SignatureAlgorithm.HS256)
				.compact();
	}
	
	public String generateToken(User user) {
		return generateToken(new HashMap<>(), user);
	}
	
	public boolean isTokenValid(String token, UserDetails userDetails) {
		final String email = extractEmail(token);
		return (email.equals(userDetails.getUsername())) && !isTokenExpired(token);
	}

	private boolean isTokenExpired(String token) {
		return extractExpiration(token).before(new Date());
	}

	private Date extractExpiration(String token) {
		return extractClaim(token, Claims::getExpiration);
	}
	
}
