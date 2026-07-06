package com.clinicamedica.dto.response;

import com.clinicamedica.model.StatusAgendamento;

import java.time.LocalDateTime;

public record AgendamentoResponseDTO(
        Integer idAgendamento,
        Integer idPaciente,
        Integer idAtendente,
        Integer idMedico,
        Integer idAgendamentoPai,
        LocalDateTime dataHora,
        StatusAgendamento status) {
}
