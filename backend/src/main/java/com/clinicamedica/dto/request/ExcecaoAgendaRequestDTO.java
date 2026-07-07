package com.clinicamedica.dto.request;

import com.clinicamedica.model.TipoExcecaoAgenda;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record ExcecaoAgendaRequestDTO(
        @NotNull Integer idMedico,
        @NotNull LocalDate dataExcecao,
        @NotNull TipoExcecaoAgenda tipoExcecao,
        LocalTime horarioInicio,
        LocalTime horarioFim) {
}
