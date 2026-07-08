package com.clinicamedica.dto.response;

import java.util.List;

public record MedicoResumoDTO(
        Integer idMedico,
        String nome,
        List<String> especialidades) {
}