package com.clinicamedica.dto.response;

public record ProntuarioClinicoResponseDTO(
        Integer idProntuario,
        Integer idAgendamento,
        String diagnostico,
        String prescricao,
        String registroObservacoes) {
}
