package com.clinicamedica.config;

import java.util.List;

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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final String ROTA_AUTH_LOGIN = "/api/auth/login";
    private static final String ROTA_AUTH_ME = "/api/auth/me";

    private static final String ROTA_PACIENTES = "/api/pacientes";
    private static final String ROTA_PACIENTES_ID = "/api/pacientes/{id}";

    private static final String ROTA_MEDICOS = "/api/medicos";
    private static final String ROTA_MEDICOS_ID = "/api/medicos/{id}";

    private static final String ROTA_ATENDENTES = "/api/atendentes";
    private static final String ROTA_ATENDENTES_ID = "/api/atendentes/{id}";

    private static final String ROTA_DISPONIBILIDADES = "/api/disponibilidades-padrao";
    private static final String ROTA_DISPONIBILIDADES_ID = "/api/disponibilidades-padrao/{id}";
    private static final String ROTA_DISPONIBILIDADES_MEDICO = "/api/disponibilidades-padrao/medico/{idMedico}";

    private static final String ROTA_EXCECOES_AGENDA = "/api/excecoes-agenda";
    private static final String ROTA_EXCECOES_AGENDA_ID = "/api/excecoes-agenda/{id}";
    private static final String ROTA_EXCECOES_AGENDA_MEDICO = "/api/excecoes-agenda/medico/{idMedico}";

    private static final String ROTA_AGENDAMENTOS = "/api/agendamentos";
    private static final String ROTA_AGENDAMENTOS_ID = "/api/agendamentos/{id}";
    private static final String ROTA_AGENDAMENTOS_HORARIOS = "/api/agendamentos/horarios-disponiveis";
    private static final String ROTA_AGENDAMENTOS_MEDICO = "/api/agendamentos/medico/{idMedico}";
    private static final String ROTA_AGENDAMENTOS_PACIENTE = "/api/agendamentos/paciente/{idPaciente}";
    private static final String ROTA_AGENDAMENTOS_CANCELAR = "/api/agendamentos/{id}/cancelar";
    private static final String ROTA_AGENDAMENTOS_CONFIRMAR = "/api/agendamentos/{id}/confirmar";
    private static final String ROTA_AGENDAMENTOS_REALIZAR = "/api/agendamentos/{id}/realizar";

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
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
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

                    req.requestMatchers(HttpMethod.GET, ROTA_AUTH_ME).authenticated();

                    // ===================================================
                    // DISPONIBILIDADES PADRÃO
                    // ===================================================
                    req.requestMatchers(HttpMethod.POST, ROTA_DISPONIBILIDADES)
                            .hasAnyRole(ROLE_ADMIN, ROLE_MEDICO);

                    req.requestMatchers(HttpMethod.GET, ROTA_DISPONIBILIDADES)
                            .hasAnyRole(ROLE_ADMIN, ROLE_ATENDENTE, ROLE_MEDICO);

                    req.requestMatchers(HttpMethod.GET, ROTA_DISPONIBILIDADES_ID)
                            .hasAnyRole(ROLE_ADMIN, ROLE_ATENDENTE, ROLE_MEDICO);

                    req.requestMatchers(HttpMethod.GET, ROTA_DISPONIBILIDADES_MEDICO)
                            .hasAnyRole(ROLE_ADMIN, ROLE_ATENDENTE, ROLE_MEDICO);

                    req.requestMatchers(HttpMethod.PUT, ROTA_DISPONIBILIDADES_ID)
                            .hasAnyRole(ROLE_ADMIN, ROLE_MEDICO);

                    req.requestMatchers(HttpMethod.DELETE, ROTA_DISPONIBILIDADES_ID)
                            .hasAnyRole(ROLE_ADMIN, ROLE_MEDICO);

                    // ===================================================
                    // EXCEÇÕES DE AGENDA
                    // ===================================================
                    req.requestMatchers(HttpMethod.POST, ROTA_EXCECOES_AGENDA)
                            .hasAnyRole(ROLE_ADMIN, ROLE_MEDICO);

                    req.requestMatchers(HttpMethod.GET, ROTA_EXCECOES_AGENDA)
                            .hasAnyRole(ROLE_ADMIN, ROLE_ATENDENTE, ROLE_MEDICO);

                    req.requestMatchers(HttpMethod.GET, ROTA_EXCECOES_AGENDA_ID)
                            .hasAnyRole(ROLE_ADMIN, ROLE_ATENDENTE, ROLE_MEDICO);

                    req.requestMatchers(HttpMethod.GET, ROTA_EXCECOES_AGENDA_MEDICO)
                            .hasAnyRole(ROLE_ADMIN, ROLE_ATENDENTE, ROLE_MEDICO);

                    req.requestMatchers(HttpMethod.PUT, ROTA_EXCECOES_AGENDA_ID)
                            .hasAnyRole(ROLE_ADMIN, ROLE_MEDICO);

                    req.requestMatchers(HttpMethod.DELETE, ROTA_EXCECOES_AGENDA_ID)
                            .hasAnyRole(ROLE_ADMIN, ROLE_MEDICO);

                    // ===================================================
                    // AGENDAMENTOS
                    // ===================================================
                    req.requestMatchers(HttpMethod.POST, ROTA_AGENDAMENTOS)
                            .hasAnyRole(ROLE_ADMIN, ROLE_ATENDENTE, ROLE_PACIENTE);

                    req.requestMatchers(HttpMethod.GET, ROTA_AGENDAMENTOS)
                            .hasAnyRole(ROLE_ADMIN, ROLE_ATENDENTE, ROLE_MEDICO);

                    req.requestMatchers(HttpMethod.GET, ROTA_AGENDAMENTOS_ID)
                            .authenticated();

                    req.requestMatchers(HttpMethod.GET, ROTA_AGENDAMENTOS_HORARIOS)
                            .authenticated();

                    req.requestMatchers(HttpMethod.GET, ROTA_AGENDAMENTOS_MEDICO)
                            .hasAnyRole(ROLE_ADMIN, ROLE_ATENDENTE, ROLE_MEDICO);

                    req.requestMatchers(HttpMethod.GET, ROTA_AGENDAMENTOS_PACIENTE)
                            .hasAnyRole(ROLE_ADMIN, ROLE_ATENDENTE, ROLE_MEDICO, ROLE_PACIENTE);

                    req.requestMatchers(HttpMethod.PUT, ROTA_AGENDAMENTOS_ID)
                            .hasAnyRole(ROLE_ADMIN, ROLE_ATENDENTE, ROLE_MEDICO);

                    req.requestMatchers(HttpMethod.PATCH, ROTA_AGENDAMENTOS_CANCELAR)
                            .hasAnyRole(ROLE_ADMIN, ROLE_ATENDENTE, ROLE_PACIENTE);

                    req.requestMatchers(HttpMethod.PATCH, ROTA_AGENDAMENTOS_CONFIRMAR)
                            .hasAnyRole(ROLE_ADMIN, ROLE_ATENDENTE);

                    req.requestMatchers(HttpMethod.PATCH, ROTA_AGENDAMENTOS_REALIZAR)
                            .hasAnyRole(ROLE_ADMIN, ROLE_MEDICO);

                    req.requestMatchers(HttpMethod.DELETE, ROTA_AGENDAMENTOS_ID)
                            .hasAnyRole(ROLE_ADMIN, ROLE_ATENDENTE);

                    // Qualquer outra rota não mapeada explicitamente será negada por segurança
                    req.anyRequest().denyAll();
                })
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
    }
}