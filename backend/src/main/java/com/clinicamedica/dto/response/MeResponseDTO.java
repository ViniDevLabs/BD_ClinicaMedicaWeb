package com.clinicamedica.dto.response;

import java.util.List;

public record MeResponseDTO(
        Integer id,
        String cpf,
        String nome,
        String email,
        List<String> perfis
) {}