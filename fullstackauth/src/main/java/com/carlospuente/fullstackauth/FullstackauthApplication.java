package com.carlospuente.fullstackauth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class FullstackauthApplication {

	public static void main(String[] args) {
		SpringApplication.run(FullstackauthApplication.class, args);
	}

}
