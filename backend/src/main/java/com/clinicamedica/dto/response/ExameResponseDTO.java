package com.clinicamedica.dto.response;

import com.clinicamedica.model.LocalRealizacaoExame;
import com.clinicamedica.model.StatusExame;

import java.time.LocalDate;

public record ExameResponseDTO(
        Integer idExame,
        Integer idAgendamento,
        String nomeExame,
        LocalDate dataSolicitacao,
        LocalRealizacaoExame localRealizacao,
        String observacoesMedicas,
        String arquivoLaudoPath,
        StatusExame status) {
}
