package com.clinicamedica.dto.response;

import java.time.LocalDate;

public record PacienteResponseDTO(
        Integer id,
        String cpf,
        String nome,
        String email,
        LocalDate dataNascimento,
        Integer ehAdministrador,
        String convenio,
        String numCarteirinha) {
}