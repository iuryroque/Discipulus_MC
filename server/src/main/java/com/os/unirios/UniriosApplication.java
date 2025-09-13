package com.os.unirios;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class UniriosApplication {

	public static void main(String[] args) {
		SpringApplication.run(UniriosApplication.class, args);
	}

}
