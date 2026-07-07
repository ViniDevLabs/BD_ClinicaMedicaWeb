package com.clinicamedica.dto.request;

import com.clinicamedica.model.LocalRealizacaoExame;
import com.clinicamedica.model.StatusExame;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ExameRequestDTO(
        @NotNull Integer idAgendamento,
        @NotNull String nomeExame,
        @NotNull LocalDate dataSolicitacao,
        @NotNull LocalRealizacaoExame localRealizacao,
        String observacoesMedicas,
        String arquivoLaudoPath,
        StatusExame status) {
}
