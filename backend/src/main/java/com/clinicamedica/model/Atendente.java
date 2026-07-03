package com.clinicamedica.model;

public class Atendente {
    private Pessoa pessoa;
    private String matricula;

    public Atendente(Pessoa pessoa, String matricula) {
        this.pessoa = pessoa;
        this.matricula = matricula;
    }

    public Pessoa getPessoa() {
        return pessoa;
    }

    public String getMatricula() {
        return matricula;
    }

    public static class Builder {
        private Pessoa pessoa;
        private String matricula;

        public Builder pessoa(Pessoa pessoa) {
            this.pessoa = pessoa;
            return this;
        }

        public Builder matricula(String matricula) {
            this.matricula = matricula;
            return this;
        }

        public Atendente build() {
            return new Atendente(pessoa, matricula);
        }
    }
}