package com.clinicamedica.config;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.clinicamedica.exception.CredenciaisInvalidasException;
import com.clinicamedica.exception.TokenInvalidoException;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<Object> handleDuplicateKey(DuplicateKeyException ex) {
        String mensagem = "Conflito de dados: O registro já existe.";
        String detalhe = ex.getCause() != null
                ? ex.getCause().getMessage()
                : ex.getMessage();

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of(
                        "erro", mensagem,
                        "detalhe", detalhe));
    }

    @ExceptionHandler(EmptyResultDataAccessException.class)
    public ResponseEntity<Object> handleNotFound(EmptyResultDataAccessException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", "Registro não encontrado."));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Object> handleIllegalState(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("erro", ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("erro", ex.getMessage()));
    }

    @ExceptionHandler(CredenciaisInvalidasException.class)
    public ResponseEntity<Object> handleCredenciaisInvalidas(CredenciaisInvalidasException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("erro", ex.getMessage()));
    }

    @ExceptionHandler(TokenInvalidoException.class)
    public ResponseEntity<Object> handleTokenInvalido(TokenInvalidoException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("erro", ex.getMessage()));
    }

    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<Object> handleAccessDenied(org.springframework.security.access.AccessDeniedException ex) {
        return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN)
                .body(Map.of(
                        "erro", "Acesso Proibido (403)",
                        "detalhe", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String erroPrincipal = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(fieldError -> {
                    String mensagem = fieldError.getDefaultMessage();
                    return mensagem != null ? mensagem : "Dados inválidos na requisição.";
                })
                .orElse("Dados inválidos na requisição.");

        Map<String, String> camposComErro = new LinkedHashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            camposComErro.merge(
                    fieldError.getField(),
                    Objects.requireNonNullElse(
                            fieldError.getDefaultMessage(),
                            "Mensagem não informada."),
                    (m1, m2) -> m1 + ", " + m2);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "erro", erroPrincipal,
                        "detalhes", camposComErro));
    }
}