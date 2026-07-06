package com.clinicamedica.dto.response;

import com.clinicamedica.model.DiaSemana;

import java.time.LocalDate;
import java.time.LocalTime;

public record DisponibilidadePadraoResponseDTO(
        Integer idDisponibilidade,
        Integer idMedico,
        LocalDate dataInicio,
        LocalDate dataFim,
        LocalTime horarioInicio,
        LocalTime horarioFim,
        DiaSemana diaSemana,
        Integer duracaoConsulta) {
}
