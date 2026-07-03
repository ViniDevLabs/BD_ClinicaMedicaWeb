package com.clinicamedica.dto.request;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(
        @NotBlank String cpf,
        @NotBlank String senha) {
}