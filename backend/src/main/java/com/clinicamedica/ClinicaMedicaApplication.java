package com.clinicamedica;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration;

@SpringBootApplication(exclude = { UserDetailsServiceAutoConfiguration.class })
public class ClinicaMedicaApplication {

    public static void main(String[] args) {
        SpringApplication.run(ClinicaMedicaApplication.class, args);
    }

}
