package com.clinicamedica.mapper;

import com.clinicamedica.dto.request.MedicoRequestDTO;
import com.clinicamedica.dto.response.MedicoResponseDTO;
import com.clinicamedica.model.Medico;
import com.clinicamedica.model.Pessoa;

import java.util.List;

public class MedicoMapper {

    private MedicoMapper() {
    }

    public static Medico toDomain(MedicoRequestDTO dto, Integer pessoaId) {
        Pessoa pessoa = new Pessoa.Builder()
                .id(pessoaId)
                .cpf(dto.cpf())
                .nome(dto.nome())
                .email(dto.email())
                .senha(dto.senha())
                .dataNascimento(dto.dataNascimento())
                .ehAdministrador(dto.ehAdministrador() != null ? dto.ehAdministrador() : 0)
                .build();

        return new Medico.Builder()
                .pessoa(pessoa)
                .numero(dto.numero())
                .estado(dto.estado())
                .especialidades(dto.especialidades())
                .build();
    }

    public static MedicoResponseDTO toResponse(Medico medico) {
        return new MedicoResponseDTO(
                medico.getPessoa().getId(),
                medico.getPessoa().getCpf(),
                medico.getPessoa().getNome(),
                medico.getPessoa().getEmail(),
                medico.getPessoa().getDataNascimento(),
                medico.getPessoa().getEhAdministrador(),
                medico.getNumero(),
                medico.getEstado(),
                medico.getEspecialidades());
    }

    public static List<MedicoResponseDTO> toResponseList(List<Medico> medicos) {
        return medicos.stream()
                .map(MedicoMapper::toResponse)
                .toList();
    }
}