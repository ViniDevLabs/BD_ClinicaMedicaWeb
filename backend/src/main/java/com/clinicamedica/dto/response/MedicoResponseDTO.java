package com.clinicamedica.dto.response;

import java.time.LocalDate;
import java.util.List;

public record MedicoResponseDTO(
        Integer id,
        String cpf,
        String nome,
        String email,
        LocalDate dataNascimento,
        Integer ehAdministrador,
        Integer numero,
        String estado,
        List<String> especialidades) {
}