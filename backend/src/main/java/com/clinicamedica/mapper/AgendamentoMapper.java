package com.clinicamedica.mapper;

import com.clinicamedica.dto.request.AgendamentoRequestDTO;
import com.clinicamedica.dto.response.AgendamentoResponseDTO;
import com.clinicamedica.dto.response.AtendenteResumoDTO;
import com.clinicamedica.dto.response.MedicoResumoDTO;
import com.clinicamedica.dto.response.PacienteResumoDTO;
import com.clinicamedica.model.Agendamento;
import com.clinicamedica.model.Atendente;
import com.clinicamedica.model.Medico;
import com.clinicamedica.model.Paciente;
import com.clinicamedica.model.Pessoa;
import com.clinicamedica.model.StatusAgendamento;

import java.util.List;

public class AgendamentoMapper {

    private AgendamentoMapper() {
    }

    public static Agendamento toDomain(AgendamentoRequestDTO dto, Integer idAgendamento) {
        Paciente paciente = new Paciente.Builder()
                .pessoa(new Pessoa.Builder().id(dto.idPaciente()).build())
                .build();

        Atendente atendente = dto.idAtendente() != null
                ? new Atendente.Builder().pessoa(new Pessoa.Builder().id(dto.idAtendente()).build()).build()
                : null;

        Medico medico = new Medico.Builder()
                .pessoa(new Pessoa.Builder().id(dto.idMedico()).build())
                .build();

        return new Agendamento.Builder()
                .idAgendamento(idAgendamento)
                .paciente(paciente)
                .atendente(atendente)
                .medico(medico)
                .idAgendamentoPai(dto.idAgendamentoPai())
                .dataHora(dto.dataHora())
                .status(dto.status() != null ? dto.status() : StatusAgendamento.AGENDADO)
                .build();
    }

    public static AgendamentoResponseDTO toResponse(Agendamento agendamento) {
        if (agendamento == null)
            return null;

        PacienteResumoDTO pacienteDTO = new PacienteResumoDTO(
                agendamento.getPaciente().getPessoa().getId(),
                agendamento.getPaciente().getPessoa().getNome(),
                agendamento.getPaciente().getPessoa().getCpf());

        MedicoResumoDTO medicoDTO = new MedicoResumoDTO(
                agendamento.getMedico().getPessoa().getId(),
                agendamento.getMedico().getPessoa().getNome(),
                agendamento.getMedico().getEspecialidades());

        AtendenteResumoDTO atendenteDTO = null;
        if (agendamento.getAtendente() != null && agendamento.getAtendente().getPessoa() != null) {
            atendenteDTO = new AtendenteResumoDTO(
                    agendamento.getAtendente().getPessoa().getId(),
                    agendamento.getAtendente().getPessoa().getNome());
        }

        return new AgendamentoResponseDTO(
                agendamento.getIdAgendamento(),
                pacienteDTO,
                atendenteDTO,
                medicoDTO,
                agendamento.getIdAgendamentoPai(),
                agendamento.getDataHora(),
                agendamento.getStatus());
    }

    public static List<AgendamentoResponseDTO> toResponseList(List<Agendamento> agendamentos) {
        return agendamentos.stream()
                .map(AgendamentoMapper::toResponse)
                .toList();
    }
}