package com.clinicamedica.dto.request;

import com.clinicamedica.model.DiaSemana;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalTime;

public record DisponibilidadePadraoRequestDTO(
        @NotNull Integer idMedico,
        @NotNull LocalDate dataInicio,
        LocalDate dataFim,
        @NotNull LocalTime horarioInicio,
        @NotNull LocalTime horarioFim,
        @NotNull DiaSemana diaSemana,
        @NotNull @Positive Integer duracaoConsulta) {
}
