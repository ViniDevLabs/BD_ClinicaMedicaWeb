package com.clinicamedica.model;

public class Paciente {
    private Pessoa pessoa;
    private String convenio;
    private String numCarteirinha;

    public Paciente(Pessoa pessoa, String convenio, String numCarteirinha) {
        this.pessoa = pessoa;
        this.convenio = convenio;
        this.numCarteirinha = numCarteirinha;
    }

    public Pessoa getPessoa() {
        return pessoa;
    }

    public String getConvenio() {
        return convenio;
    }

    public String getNumCarteirinha() {
        return numCarteirinha;
    }

    public static class Builder {
        private Pessoa pessoa;
        private String convenio;
        private String numCarteirinha;

        public Builder pessoa(Pessoa pessoa) {
            this.pessoa = pessoa;
            return this;
        }

        public Builder convenio(String convenio) {
            this.convenio = convenio;
            return this;
        }

        public Builder numCarteirinha(String numCarteirinha) {
            this.numCarteirinha = numCarteirinha;
            return this;
        }

        public Paciente build() {
            return new Paciente(pessoa, convenio, numCarteirinha);
        }
    }
}