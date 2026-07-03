package com.clinicamedica.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.clinicamedica.exception.TokenInvalidoException;
import com.clinicamedica.model.Pessoa;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    @Value("${api.security.token.expiration_hours:2}")
    private Integer expirationHours;

    private static final String ISSUER = "clinica-medica-api";

    public String gerarToken(Pessoa pessoa, List<String> perfis) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer(ISSUER)
                    .withSubject(pessoa.getCpf())
                    .withClaim("id", pessoa.getId())
                    .withClaim("perfis", perfis)
                    .withExpiresAt(gerarDataExpiracao())
                    .sign(algoritmo);
        } catch (JWTCreationException exception) {
            throw new TokenInvalidoException(
                    "Erro ao gerar token JWT.",
                    exception);
        }
    }

    public DecodedJWT validarToken(String token) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(secret);
            return JWT.require(algoritmo)
                    .withIssuer(ISSUER)
                    .build()
                    .verify(token);
        } catch (JWTVerificationException exception) {
            throw new TokenInvalidoException(
                    "Token JWT inválido ou expirado.",
                    exception);
        }
    }

    private Instant gerarDataExpiracao() {
        return Instant.now()
                .plusSeconds(expirationHours * 3600L);
    }
}