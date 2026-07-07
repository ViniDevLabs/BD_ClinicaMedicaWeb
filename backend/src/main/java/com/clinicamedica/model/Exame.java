package com.clinicamedica.model;

import java.time.LocalDate;

public class Exame {
    private Integer idExame;
    private Integer idAgendamento;
    private String nomeExame;
    private LocalDate dataSolicitacao;
    private LocalRealizacaoExame localRealizacao;
    private String observacoesMedicas;
    private String arquivoLaudoPath;
    private StatusExame status;

    public Exame(Integer idExame, Integer idAgendamento, String nomeExame, LocalDate dataSolicitacao,
            LocalRealizacaoExame localRealizacao, String observacoesMedicas, String arquivoLaudoPath,
            StatusExame status) {
        this.idExame = idExame;
        this.idAgendamento = idAgendamento;
        this.nomeExame = nomeExame;
        this.dataSolicitacao = dataSolicitacao;
        this.localRealizacao = localRealizacao;
        this.observacoesMedicas = observacoesMedicas;
        this.arquivoLaudoPath = arquivoLaudoPath;
        this.status = status;
    }

    public Integer getIdExame() {
        return idExame;
    }

    public Integer getIdAgendamento() {
        return idAgendamento;
    }

    public String getNomeExame() {
        return nomeExame;
    }

    public LocalDate getDataSolicitacao() {
        return dataSolicitacao;
    }

    public LocalRealizacaoExame getLocalRealizacao() {
        return localRealizacao;
    }

    public String getObservacoesMedicas() {
        return observacoesMedicas;
    }

    public String getArquivoLaudoPath() {
        return arquivoLaudoPath;
    }

    public StatusExame getStatus() {
        return status;
    }

    public static class Builder {
        private Integer idExame;
        private Integer idAgendamento;
        private String nomeExame;
        private LocalDate dataSolicitacao;
        private LocalRealizacaoExame localRealizacao;
        private String observacoesMedicas;
        private String arquivoLaudoPath;
        private StatusExame status = StatusExame.SOLICITADO;

        public Builder idExame(Integer idExame) {
            this.idExame = idExame;
            return this;
        }

        public Builder idAgendamento(Integer idAgendamento) {
            this.idAgendamento = idAgendamento;
            return this;
        }

        public Builder nomeExame(String nomeExame) {
            this.nomeExame = nomeExame;
            return this;
        }

        public Builder dataSolicitacao(LocalDate dataSolicitacao) {
            this.dataSolicitacao = dataSolicitacao;
            return this;
        }

        public Builder localRealizacao(LocalRealizacaoExame localRealizacao) {
            this.localRealizacao = localRealizacao;
            return this;
        }

        public Builder observacoesMedicas(String observacoesMedicas) {
            this.observacoesMedicas = observacoesMedicas;
            return this;
        }

        public Builder arquivoLaudoPath(String arquivoLaudoPath) {
            this.arquivoLaudoPath = arquivoLaudoPath;
            return this;
        }

        public Builder status(StatusExame status) {
            this.status = status;
            return this;
        }

        public Exame build() {
            return new Exame(idExame, idAgendamento, nomeExame, dataSolicitacao, localRealizacao,
                    observacoesMedicas, arquivoLaudoPath, status);
        }
    }
}
