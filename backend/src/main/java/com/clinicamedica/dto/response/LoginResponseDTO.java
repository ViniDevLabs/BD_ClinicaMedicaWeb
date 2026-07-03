package com.clinicamedica.dto.response;

import java.util.List;

public record LoginResponseDTO(
        String tokenPlaceholder,
        String nome,
        String email,
        List<String> perfis) {
}