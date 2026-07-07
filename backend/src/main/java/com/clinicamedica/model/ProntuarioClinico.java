package com.clinicamedica.model;

public class ProntuarioClinico {
    private Integer idProntuario;
    private Integer idAgendamento;
    private String diagnostico;
    private String prescricao;
    private String registroObservacoes;

    public ProntuarioClinico(Integer idProntuario, Integer idAgendamento, String diagnostico, String prescricao,
            String registroObservacoes) {
        this.idProntuario = idProntuario;
        this.idAgendamento = idAgendamento;
        this.diagnostico = diagnostico;
        this.prescricao = prescricao;
        this.registroObservacoes = registroObservacoes;
    }

    public Integer getIdProntuario() {
        return idProntuario;
    }

    public Integer getIdAgendamento() {
        return idAgendamento;
    }

    public String getDiagnostico() {
        return diagnostico;
    }

    public String getPrescricao() {
        return prescricao;
    }

    public String getRegistroObservacoes() {
        return registroObservacoes;
    }

    public static class Builder {
        private Integer idProntuario;
        private Integer idAgendamento;
        private String diagnostico;
        private String prescricao;
        private String registroObservacoes;

        public Builder idProntuario(Integer idProntuario) {
            this.idProntuario = idProntuario;
            return this;
        }

        public Builder idAgendamento(Integer idAgendamento) {
            this.idAgendamento = idAgendamento;
            return this;
        }

        public Builder diagnostico(String diagnostico) {
            this.diagnostico = diagnostico;
            return this;
        }

        public Builder prescricao(String prescricao) {
            this.prescricao = prescricao;
            return this;
        }

        public Builder registroObservacoes(String registroObservacoes) {
            this.registroObservacoes = registroObservacoes;
            return this;
        }

        public ProntuarioClinico build() {
            return new ProntuarioClinico(idProntuario, idAgendamento, diagnostico, prescricao, registroObservacoes);
        }
    }
}
