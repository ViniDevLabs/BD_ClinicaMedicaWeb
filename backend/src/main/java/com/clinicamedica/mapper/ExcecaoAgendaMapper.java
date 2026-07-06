package com.clinicamedica.mapper;

import com.clinicamedica.dto.request.ExcecaoAgendaRequestDTO;
import com.clinicamedica.dto.response.ExcecaoAgendaResponseDTO;
import com.clinicamedica.model.ExcecaoAgenda;
import com.clinicamedica.model.Medico;
import com.clinicamedica.model.Pessoa;

import java.util.List;

public class ExcecaoAgendaMapper {

    private ExcecaoAgendaMapper() {
    }

    public static ExcecaoAgenda toDomain(ExcecaoAgendaRequestDTO dto, Integer idExcecao) {
        Medico medico = new Medico.Builder()
                .pessoa(new Pessoa.Builder().id(dto.idMedico()).build())
                .build();

        return new ExcecaoAgenda.Builder()
                .idExcecao(idExcecao)
                .medico(medico)
                .dataExcecao(dto.dataExcecao())
                .tipoExcecao(dto.tipoExcecao())
                .horarioInicio(dto.horarioInicio())
                .horarioFim(dto.horarioFim())
                .build();
    }

    public static ExcecaoAgendaResponseDTO toResponse(ExcecaoAgenda excecao) {
        return new ExcecaoAgendaResponseDTO(
                excecao.getIdExcecao(),
                excecao.getMedico().getPessoa().getId(),
                excecao.getDataExcecao(),
                excecao.getTipoExcecao(),
                excecao.getHorarioInicio(),
                excecao.getHorarioFim());
    }

    public static List<ExcecaoAgendaResponseDTO> toResponseList(List<ExcecaoAgenda> excecoes) {
        return excecoes.stream()
                .map(ExcecaoAgendaMapper::toResponse)
                .toList();
    }
}
