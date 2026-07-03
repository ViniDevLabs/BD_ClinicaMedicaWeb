package com.clinicamedica.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final String ROTA_AUTH_LOGIN = "/api/auth/login";

    private static final String ROTA_PACIENTES = "/api/pacientes";
    private static final String ROTA_PACIENTES_ID = "/api/pacientes/{id}";

    private static final String ROTA_MEDICOS = "/api/medicos";
    private static final String ROTA_MEDICOS_ID = "/api/medicos/{id}";

    private static final String ROTA_ATENDENTES = "/api/atendentes";
    private static final String ROTA_ATENDENTES_ID = "/api/atendentes/{id}";

    private static final String ROLE_ADMIN = "ADMINISTRADOR";
    private static final String ROLE_MEDICO = "MEDICO";
    private static final String ROLE_ATENDENTE = "ATENDENTE";
    private static final String ROLE_PACIENTE = "PACIENTE";

    private final SecurityFilter securityFilter;

    public SecurityConfig(SecurityFilter securityFilter) {
        this.securityFilter = securityFilter;
    }

    @SuppressWarnings("java:S4502")
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) {
        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(req -> {

                    // ===================================================
                    // ROTAS PÚBLICAS
                    // ===================================================
                    req.requestMatchers(HttpMethod.POST, ROTA_AUTH_LOGIN).permitAll();
                    req.requestMatchers(HttpMethod.POST, ROTA_PACIENTES).permitAll();

                    // ===================================================
                    // PACIENTES
                    // ===================================================
                    req.requestMatchers(HttpMethod.GET, ROTA_PACIENTES)
                            .hasAnyRole(ROLE_ADMIN, ROLE_ATENDENTE, ROLE_MEDICO);

                    req.requestMatchers(HttpMethod.GET, ROTA_PACIENTES_ID)
                            .authenticated();

                    req.requestMatchers(HttpMethod.PUT, ROTA_PACIENTES_ID)
                            .hasAnyRole(ROLE_ADMIN, ROLE_ATENDENTE, ROLE_PACIENTE);

                    req.requestMatchers(HttpMethod.DELETE, ROTA_PACIENTES_ID)
                            .hasRole(ROLE_ADMIN);

                    // ===================================================
                    // MÉDICOS
                    // ===================================================
                    req.requestMatchers(HttpMethod.POST, ROTA_MEDICOS)
                            .hasRole(ROLE_ADMIN);

                    req.requestMatchers(HttpMethod.GET, ROTA_MEDICOS)
                            .authenticated();

                    req.requestMatchers(HttpMethod.GET, ROTA_MEDICOS_ID)
                            .authenticated();

                    req.requestMatchers(HttpMethod.PUT, ROTA_MEDICOS_ID)
                            .hasAnyRole(ROLE_ADMIN, ROLE_MEDICO);

                    req.requestMatchers(HttpMethod.DELETE, ROTA_MEDICOS_ID)
                            .hasRole(ROLE_ADMIN);

                    // ===================================================
                    // ATENDENTES
                    // ===================================================
                    req.requestMatchers(HttpMethod.POST, ROTA_ATENDENTES)
                            .hasRole(ROLE_ADMIN);

                    req.requestMatchers(HttpMethod.GET, ROTA_ATENDENTES)
                            .hasAnyRole(ROLE_ADMIN, ROLE_ATENDENTE, ROLE_MEDICO);

                    req.requestMatchers(HttpMethod.GET, ROTA_ATENDENTES_ID)
                            .hasAnyRole(ROLE_ADMIN, ROLE_ATENDENTE, ROLE_MEDICO);

                    req.requestMatchers(HttpMethod.PUT, ROTA_ATENDENTES_ID)
                            .hasAnyRole(ROLE_ADMIN, ROLE_ATENDENTE);

                    req.requestMatchers(HttpMethod.DELETE, ROTA_ATENDENTES_ID)
                            .hasRole(ROLE_ADMIN);

                    // Qualquer outra rota não mapeada explicitamente será negada por segurança
                    req.anyRequest().denyAll();
                })
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
    }
}