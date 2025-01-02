package com.login.demo;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = {"com.login", "com.item", "com.asta"})
@MapperScan({"com.login.mapper", "com.item.mapper", "com.asta.mapper"})
@EnableScheduling
public class ProgettoLoginApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProgettoLoginApplication.class, args);
	}

}
