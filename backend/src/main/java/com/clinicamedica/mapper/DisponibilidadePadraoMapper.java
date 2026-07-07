package com.clinicamedica.mapper;

import com.clinicamedica.dto.request.DisponibilidadePadraoRequestDTO;
import com.clinicamedica.dto.response.DisponibilidadePadraoResponseDTO;
import com.clinicamedica.model.DisponibilidadePadrao;
import com.clinicamedica.model.Medico;
import com.clinicamedica.model.Pessoa;

import java.util.List;

public class DisponibilidadePadraoMapper {

    private DisponibilidadePadraoMapper() {
    }

    public static DisponibilidadePadrao toDomain(DisponibilidadePadraoRequestDTO dto, Integer idDisponibilidade) {
        Medico medico = new Medico.Builder()
                .pessoa(new Pessoa.Builder().id(dto.idMedico()).build())
                .build();

        return new DisponibilidadePadrao.Builder()
                .idDisponibilidade(idDisponibilidade)
                .medico(medico)
                .dataInicio(dto.dataInicio())
                .dataFim(dto.dataFim())
                .horarioInicio(dto.horarioInicio())
                .horarioFim(dto.horarioFim())
                .diaSemana(dto.diaSemana())
                .duracaoConsulta(dto.duracaoConsulta())
                .build();
    }

    public static DisponibilidadePadraoResponseDTO toResponse(DisponibilidadePadrao disponibilidade) {
        return new DisponibilidadePadraoResponseDTO(
                disponibilidade.getIdDisponibilidade(),
                disponibilidade.getMedico().getPessoa().getId(),
                disponibilidade.getDataInicio(),
                disponibilidade.getDataFim(),
                disponibilidade.getHorarioInicio(),
                disponibilidade.getHorarioFim(),
                disponibilidade.getDiaSemana(),
                disponibilidade.getDuracaoConsulta());
    }

    public static List<DisponibilidadePadraoResponseDTO> toResponseList(List<DisponibilidadePadrao> disponibilidades) {
        return disponibilidades.stream()
                .map(DisponibilidadePadraoMapper::toResponse)
                .toList();
    }
}
