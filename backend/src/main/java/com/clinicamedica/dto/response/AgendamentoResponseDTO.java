package com.clinicamedica.dto.response;

import com.clinicamedica.model.StatusAgendamento;
import java.time.LocalDateTime;

public record AgendamentoResponseDTO(
        Integer idAgendamento,
        PacienteResumoDTO paciente,
        AtendenteResumoDTO atendente,
        MedicoResumoDTO medico,
        Integer idAgendamentoPai,
        LocalDateTime dataHora,
        StatusAgendamento status) {
}