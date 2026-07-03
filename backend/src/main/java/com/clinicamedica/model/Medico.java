package com.clinicamedica.model;

import java.util.ArrayList;
import java.util.List;

public class Medico {
    private Pessoa pessoa;
    private Integer numero;
    private String estado;
    private List<String> especialidades;

    public Medico(Pessoa pessoa, Integer numero, String estado, List<String> especialidades) {
        this.pessoa = pessoa;
        this.numero = numero;
        this.estado = estado;
        this.especialidades = especialidades != null ? especialidades : new ArrayList<>();
    }

    public Pessoa getPessoa() {
        return pessoa;
    }

    public Integer getNumero() {
        return numero;
    }

    public String getEstado() {
        return estado;
    }

    public List<String> getEspecialidades() {
        return especialidades;
    }

    public static class Builder {
        private Pessoa pessoa;
        private Integer numero;
        private String estado;
        private List<String> especialidades = new ArrayList<>();

        public Builder pessoa(Pessoa pessoa) {
            this.pessoa = pessoa;
            return this;
        }

        public Builder numero(Integer numero) {
            this.numero = numero;
            return this;
        }

        public Builder estado(String estado) {
            this.estado = estado;
            return this;
        }

        public Builder especialidades(List<String> especialidades) {
            this.especialidades = especialidades;
            return this;
        }

        public Medico build() {
            return new Medico(pessoa, numero, estado, especialidades);
        }
    }
}