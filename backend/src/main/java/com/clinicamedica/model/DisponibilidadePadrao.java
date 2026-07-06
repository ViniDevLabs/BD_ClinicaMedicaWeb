package com.clinicamedica.model;

import java.time.LocalDate;
import java.time.LocalTime;

public class DisponibilidadePadrao {

    private Integer idDisponibilidade;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private LocalTime horarioInicio;
    private LocalTime horarioFim;
    private DiaSemana diaSemana;
    private Integer duracaoConsulta;
    private Medico medico;

    public DisponibilidadePadrao(
            Integer idDisponibilidade,
            LocalDate dataInicio,
            LocalDate dataFim,
            LocalTime horarioInicio,
            LocalTime horarioFim,
            DiaSemana diaSemana,
            Integer duracaoConsulta,
            Medico medico
    ) {
        this.idDisponibilidade = idDisponibilidade;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.horarioInicio = horarioInicio;
        this.horarioFim = horarioFim;
        this.diaSemana = diaSemana;
        this.duracaoConsulta = duracaoConsulta;
        this.medico = medico;
    }

    public Integer getIdDisponibilidade() {
        return idDisponibilidade;
    }

    public LocalDate getDataInicio() {
        return dataInicio;
    }

    public LocalDate getDataFim() {
        return dataFim;
    }

    public LocalTime getHorarioInicio() {
        return horarioInicio;
    }

    public LocalTime getHorarioFim() {
        return horarioFim;
    }

    public DiaSemana getDiaSemana() {
        return diaSemana;
    }

    public Integer getDuracaoConsulta() {
        return duracaoConsulta;
    }

    public Medico getMedico() {
        return medico;
    }

    public static class Builder {
        private Integer idDisponibilidade;
        private LocalDate dataInicio;
        private LocalDate dataFim;
        private LocalTime horarioInicio;
        private LocalTime horarioFim;
        private DiaSemana diaSemana;
        private Integer duracaoConsulta;
        private Medico medico;

        public Builder idDisponibilidade(Integer idDisponibilidade) {
            this.idDisponibilidade = idDisponibilidade;
            return this;
        }

        public Builder dataInicio(LocalDate dataInicio) {
            this.dataInicio = dataInicio;
            return this;
        }

        public Builder dataFim(LocalDate dataFim) {
            this.dataFim = dataFim;
            return this;
        }

        public Builder horarioInicio(LocalTime horarioInicio) {
            this.horarioInicio = horarioInicio;
            return this;
        }

        public Builder horarioFim(LocalTime horarioFim) {
            this.horarioFim = horarioFim;
            return this;
        }

        public Builder diaSemana(DiaSemana diaSemana) {
            this.diaSemana = diaSemana;
            return this;
        }

        public Builder duracaoConsulta(Integer duracaoConsulta) {
            this.duracaoConsulta = duracaoConsulta;
            return this;
        }

        public Builder medico(Medico medico) {
            this.medico = medico;
            return this;
        }

        public DisponibilidadePadrao build() {
            return new DisponibilidadePadrao(
                    idDisponibilidade,
                    dataInicio,
                    dataFim,
                    horarioInicio,
                    horarioFim,
                    diaSemana,
                    duracaoConsulta,
                    medico
            );
        }
    }
}