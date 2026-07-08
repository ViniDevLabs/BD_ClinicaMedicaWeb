package com.clinicamedica.dto.response;

public record PacienteResumoDTO(
        Integer idPaciente,
        String nome,
        String cpf) {
}