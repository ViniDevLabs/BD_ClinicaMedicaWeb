package com.clinicamedica.dto.response;

import com.clinicamedica.model.TipoExcecaoAgenda;

import java.time.LocalDate;
import java.time.LocalTime;

public record ExcecaoAgendaResponseDTO(
        Integer idExcecao,
        Integer idMedico,
        LocalDate dataExcecao,
        TipoExcecaoAgenda tipoExcecao,
        LocalTime horarioInicio,
        LocalTime horarioFim) {
}
