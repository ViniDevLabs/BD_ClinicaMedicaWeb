package com.clinicamedica.model;

import java.time.LocalDate;
import java.time.LocalTime;

public class ExcecaoAgenda {
    private Integer idExcecao;
    private Medico medico;
    private LocalDate dataExcecao;
    private TipoExcecaoAgenda tipoExcecao;
    private LocalTime horarioInicio;
    private LocalTime horarioFim;

    public ExcecaoAgenda(Integer idExcecao, Medico medico, LocalDate dataExcecao, TipoExcecaoAgenda tipoExcecao,
            LocalTime horarioInicio, LocalTime horarioFim) {
        this.idExcecao = idExcecao;
        this.medico = medico;
        this.dataExcecao = dataExcecao;
        this.tipoExcecao = tipoExcecao;
        this.horarioInicio = horarioInicio;
        this.horarioFim = horarioFim;
    }

    public Integer getIdExcecao() {
        return idExcecao;
    }

    public Medico getMedico() {
        return medico;
    }

    public LocalDate getDataExcecao() {
        return dataExcecao;
    }

    public TipoExcecaoAgenda getTipoExcecao() {
        return tipoExcecao;
    }

    public LocalTime getHorarioInicio() {
        return horarioInicio;
    }

    public LocalTime getHorarioFim() {
        return horarioFim;
    }

    public static class Builder {
        private Integer idExcecao;
        private Medico medico;
        private LocalDate dataExcecao;
        private TipoExcecaoAgenda tipoExcecao;
        private LocalTime horarioInicio;
        private LocalTime horarioFim;

        public Builder idExcecao(Integer idExcecao) {
            this.idExcecao = idExcecao;
            return this;
        }

        public Builder medico(Medico medico) {
            this.medico = medico;
            return this;
        }

        public Builder dataExcecao(LocalDate dataExcecao) {
            this.dataExcecao = dataExcecao;
            return this;
        }

        public Builder tipoExcecao(TipoExcecaoAgenda tipoExcecao) {
            this.tipoExcecao = tipoExcecao;
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

        public ExcecaoAgenda build() {
            return new ExcecaoAgenda(idExcecao, medico, dataExcecao, tipoExcecao, horarioInicio, horarioFim);
        }
    }
}
