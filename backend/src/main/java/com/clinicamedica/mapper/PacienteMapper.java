package com.clinicamedica.mapper;

import com.clinicamedica.dto.request.PacienteRequestDTO;
import com.clinicamedica.dto.response.PacienteResponseDTO;
import com.clinicamedica.model.Paciente;
import com.clinicamedica.model.Pessoa;

import java.util.List;

public class PacienteMapper {
    private PacienteMapper() {
    }

    public static Paciente toDomain(PacienteRequestDTO dto, Integer pessoaId) {
        Pessoa pessoa = new Pessoa.Builder()
                .id(pessoaId)
                .cpf(dto.cpf())
                .nome(dto.nome())
                .email(dto.email())
                .senha(dto.senha())
                .dataNascimento(dto.dataNascimento())
                .ehAdministrador(dto.ehAdministrador() != null ? dto.ehAdministrador() : 0)
                .build();

        return new Paciente.Builder()
                .pessoa(pessoa)
                .convenio(dto.convenio())
                .numCarteirinha(dto.numCarteirinha())
                .build();
    }

    public static PacienteResponseDTO toResponse(Paciente paciente) {
        return new PacienteResponseDTO(
                paciente.getPessoa().getId(),
                paciente.getPessoa().getCpf(),
                paciente.getPessoa().getNome(),
                paciente.getPessoa().getEmail(),
                paciente.getPessoa().getDataNascimento(),
                paciente.getPessoa().getEhAdministrador(),
                paciente.getConvenio(),
                paciente.getNumCarteirinha());
    }

    public static List<PacienteResponseDTO> toResponseList(List<Paciente> pacientes) {
        return pacientes.stream()
                .map(PacienteMapper::toResponse)
                .toList();
    }
}