package com.clinicamedica.mapper;

import com.clinicamedica.dto.request.AtendenteRequestDTO;
import com.clinicamedica.dto.response.AtendenteResponseDTO;
import com.clinicamedica.model.Atendente;
import com.clinicamedica.model.Pessoa;

import java.util.List;

public class AtendenteMapper {

    private AtendenteMapper() {
    }

    public static Atendente toDomain(AtendenteRequestDTO dto, Integer pessoaId) {
        Pessoa pessoa = new Pessoa.Builder()
                .id(pessoaId)
                .cpf(dto.cpf())
                .nome(dto.nome())
                .email(dto.email())
                .senha(dto.senha())
                .dataNascimento(dto.dataNascimento())
                .ehAdministrador(dto.ehAdministrador() != null ? dto.ehAdministrador() : 0)
                .build();

        return new Atendente.Builder()
                .pessoa(pessoa)
                .matricula(dto.matricula())
                .build();
    }

    public static AtendenteResponseDTO toResponse(Atendente atendente) {
        return new AtendenteResponseDTO(
                atendente.getPessoa().getId(),
                atendente.getPessoa().getCpf(),
                atendente.getPessoa().getNome(),
                atendente.getPessoa().getEmail(),
                atendente.getPessoa().getDataNascimento(),
                atendente.getPessoa().getEhAdministrador(),
                atendente.getMatricula());
    }

    public static List<AtendenteResponseDTO> toResponseList(List<Atendente> atendentes) {
        return atendentes.stream()
                .map(AtendenteMapper::toResponse)
                .toList();
    }
}