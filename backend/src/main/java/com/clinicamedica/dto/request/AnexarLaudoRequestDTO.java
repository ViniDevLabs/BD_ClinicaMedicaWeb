package com.clinicamedica.dto.request;

import jakarta.validation.constraints.NotNull;

public record AnexarLaudoRequestDTO(
        @NotNull String arquivoLaudoPath) {
}
