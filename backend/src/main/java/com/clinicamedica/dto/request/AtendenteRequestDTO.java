package com.clinicamedica.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;

public record AtendenteRequestDTO(
        @NotBlank @CPF String cpf,
        @NotBlank String nome,
        @NotBlank @Email String email,
        String senha,
        @NotNull LocalDate dataNascimento,
        Integer ehAdministrador,
        @NotBlank String matricula) {
}