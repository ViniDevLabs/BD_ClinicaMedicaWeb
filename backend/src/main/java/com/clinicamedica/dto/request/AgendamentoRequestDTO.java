package com.clinicamedica.dto.request;

import com.clinicamedica.model.StatusAgendamento;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record AgendamentoRequestDTO(
        @NotNull Integer idPaciente,
        Integer idAtendente,
        @NotNull Integer idMedico,
        Integer idAgendamentoPai,
        @NotNull LocalDateTime dataHora,
        StatusAgendamento status) {
}
