package com.clinicamedica.model;

import java.time.LocalDate;

public class Pessoa {
    private Integer id;
    private String cpf;
    private String nome;
    private String email;
    private String senha;
    private LocalDate dataNascimento;
    private Integer ehAdministrador;

    public Pessoa(Integer id, String cpf, String nome, String email, String senha, LocalDate dataNascimento,
            Integer ehAdministrador) {
        this.id = id;
        this.cpf = cpf;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.dataNascimento = dataNascimento;
        this.ehAdministrador = ehAdministrador;
    }

    public Integer getId() {
        return id;
    }

    public String getCpf() {
        return cpf;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public String getSenha() {
        return senha;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public Integer getEhAdministrador() {
        return ehAdministrador;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public static class Builder {
        private Integer id;
        private String cpf;
        private String nome;
        private String email;
        private String senha;
        private LocalDate dataNascimento;
        private Integer ehAdministrador = 0;

        public Builder id(Integer id) {
            this.id = id;
            return this;
        }

        public Builder cpf(String cpf) {
            this.cpf = cpf;
            return this;
        }

        public Builder nome(String nome) {
            this.nome = nome;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder senha(String senha) {
            this.senha = senha;
            return this;
        }

        public Builder dataNascimento(LocalDate dataNascimento) {
            this.dataNascimento = dataNascimento;
            return this;
        }

        public Builder ehAdministrador(Integer ehAdministrador) {
            this.ehAdministrador = ehAdministrador;
            return this;
        }

        public Pessoa build() {
            return new Pessoa(id, cpf, nome, email, senha, dataNascimento, ehAdministrador);
        }
    }
}