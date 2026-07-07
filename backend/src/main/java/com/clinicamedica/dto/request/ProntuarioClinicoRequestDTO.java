package com.clinicamedica.dto.request;

import jakarta.validation.constraints.NotNull;

public record ProntuarioClinicoRequestDTO(
        @NotNull Integer idAgendamento,
        String diagnostico,
        String prescricao,
        String registroObservacoes) {
}
