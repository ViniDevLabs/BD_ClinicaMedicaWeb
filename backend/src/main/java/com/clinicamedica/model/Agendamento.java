package com.clinicamedica.model;

import java.time.LocalDateTime;

public class Agendamento {
    private Integer idAgendamento;
    private Paciente paciente;
    private Atendente atendente;
    private Medico medico;
    private Integer idAgendamentoPai;
    private LocalDateTime dataHora;
    private StatusAgendamento status;

    public Agendamento(Integer idAgendamento, Paciente paciente, Atendente atendente, Medico medico,
            Integer idAgendamentoPai, LocalDateTime dataHora, StatusAgendamento status) {
        this.idAgendamento = idAgendamento;
        this.paciente = paciente;
        this.atendente = atendente;
        this.medico = medico;
        this.idAgendamentoPai = idAgendamentoPai;
        this.dataHora = dataHora;
        this.status = status;
    }

    public Integer getIdAgendamento() {
        return idAgendamento;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public Atendente getAtendente() {
        return atendente;
    }

    public Medico getMedico() {
        return medico;
    }

    public Integer getIdAgendamentoPai() {
        return idAgendamentoPai;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public StatusAgendamento getStatus() {
        return status;
    }

    public static class Builder {
        private Integer idAgendamento;
        private Paciente paciente;
        private Atendente atendente;
        private Medico medico;
        private Integer idAgendamentoPai;
        private LocalDateTime dataHora;
        private StatusAgendamento status = StatusAgendamento.AGENDADO;

        public Builder idAgendamento(Integer idAgendamento) {
            this.idAgendamento = idAgendamento;
            return this;
        }

        public Builder paciente(Paciente paciente) {
            this.paciente = paciente;
            return this;
        }

        public Builder atendente(Atendente atendente) {
            this.atendente = atendente;
            return this;
        }

        public Builder medico(Medico medico) {
            this.medico = medico;
            return this;
        }

        public Builder idAgendamentoPai(Integer idAgendamentoPai) {
            this.idAgendamentoPai = idAgendamentoPai;
            return this;
        }

        public Builder dataHora(LocalDateTime dataHora) {
            this.dataHora = dataHora;
            return this;
        }

        public Builder status(StatusAgendamento status) {
            this.status = status;
            return this;
        }

        public Agendamento build() {
            return new Agendamento(idAgendamento, paciente, atendente, medico, idAgendamentoPai, dataHora, status);
        }
    }
}
