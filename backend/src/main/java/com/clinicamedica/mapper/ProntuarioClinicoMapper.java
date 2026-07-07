package com.clinicamedica.mapper;

import com.clinicamedica.dto.request.ProntuarioClinicoRequestDTO;
import com.clinicamedica.dto.response.ProntuarioClinicoResponseDTO;
import com.clinicamedica.model.ProntuarioClinico;

import java.util.List;

public class ProntuarioClinicoMapper {

    private ProntuarioClinicoMapper() {
    }

    public static ProntuarioClinico toDomain(ProntuarioClinicoRequestDTO dto, Integer idProntuario) {
        return new ProntuarioClinico.Builder()
                .idProntuario(idProntuario)
                .idAgendamento(dto.idAgendamento())
                .diagnostico(dto.diagnostico())
                .prescricao(dto.prescricao())
                .registroObservacoes(dto.registroObservacoes())
                .build();
    }

    public static ProntuarioClinicoResponseDTO toResponse(ProntuarioClinico prontuario) {
        return new ProntuarioClinicoResponseDTO(
                prontuario.getIdProntuario(),
                prontuario.getIdAgendamento(),
                prontuario.getDiagnostico(),
                prontuario.getPrescricao(),
                prontuario.getRegistroObservacoes());
    }

    public static List<ProntuarioClinicoResponseDTO> toResponseList(List<ProntuarioClinico> prontuarios) {
        return prontuarios.stream()
                .map(ProntuarioClinicoMapper::toResponse)
                .toList();
    }
}
