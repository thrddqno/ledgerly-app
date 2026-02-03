package io.github.thrddqno.ledgerly;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import io.github.thrddqno.ledgerly.user.User;
import io.github.thrddqno.ledgerly.user.UserRepository;

@SpringBootApplication
public class LedgerlyApplication {

	public static void main(String[] args) {
		SpringApplication.run(LedgerlyApplication.class, args);
	}
	
	
	@Bean
	public CommandLineRunner commandLineRunner(UserRepository repository) {
		return args -> {
			var user = User.builder()
			.firstName("Antonio")
			.lastName("Dioquino")
			.email("therddioquino@hotmail.com")
			.password("secret")
			.build();
			
			repository.save(user);
		};
	}

}
