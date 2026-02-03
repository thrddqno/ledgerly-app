package io.github.thrddqno.ledgerly.domain.models;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

import org.hibernate.annotations.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@NotBlank
	private String firstName;
	
	@NotBlank
	private String lastName;
	
	@Email
	@NotBlank
	@Column(unique = true)
	private String email;
	
	@NotBlank
	private String password;
	
	@CreationTimestamp
	@Column(updatable = false)
	private LocalDateTime createdAt;
}
