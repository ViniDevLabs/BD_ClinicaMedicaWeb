package com.clinicamedica.mapper;

import com.clinicamedica.dto.request.ExameRequestDTO;
import com.clinicamedica.dto.response.ExameResponseDTO;
import com.clinicamedica.model.Exame;
import com.clinicamedica.model.StatusExame;

import java.util.List;

public class ExameMapper {

    private ExameMapper() {
    }

    public static Exame toDomain(ExameRequestDTO dto, Integer idExame) {
        return new Exame.Builder()
                .idExame(idExame)
                .idAgendamento(dto.idAgendamento())
                .nomeExame(dto.nomeExame())
                .dataSolicitacao(dto.dataSolicitacao())
                .localRealizacao(dto.localRealizacao())
                .observacoesMedicas(dto.observacoesMedicas())
                .arquivoLaudoPath(dto.arquivoLaudoPath())
                .status(dto.status() != null ? dto.status() : StatusExame.SOLICITADO)
                .build();
    }

    public static ExameResponseDTO toResponse(Exame exame) {
        return new ExameResponseDTO(
                exame.getIdExame(),
                exame.getIdAgendamento(),
                exame.getNomeExame(),
                exame.getDataSolicitacao(),
                exame.getLocalRealizacao(),
                exame.getObservacoesMedicas(),
                exame.getArquivoLaudoPath(),
                exame.getStatus());
    }

    public static List<ExameResponseDTO> toResponseList(List<Exame> exames) {
        return exames.stream()
                .map(ExameMapper::toResponse)
                .toList();
    }
}
