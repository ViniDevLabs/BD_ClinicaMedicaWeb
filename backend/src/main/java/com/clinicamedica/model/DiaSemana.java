package com.clinicamedica.model;

public enum DiaSemana {
    DOMINGO("DOMINGO"),
    SEGUNDA("SEGUNDA"),
    TERCA("TERCA"),
    QUARTA("QUARTA"),
    QUINTA("QUINTA"),
    SEXTA("SEXTA"),
    SABADO("SABADO");

    private final String valorBanco;

    DiaSemana(String valorBanco) {
        this.valorBanco = valorBanco;
    }

    public String getValorBanco() {
        return valorBanco;
    }

    public static DiaSemana fromValorBanco(String valorBanco) {
        for (DiaSemana diaSemana : DiaSemana.values()) {
            if (diaSemana.valorBanco.equalsIgnoreCase(valorBanco) || diaSemana.name().equalsIgnoreCase(valorBanco)) {
                return diaSemana;
            }
        }

        throw new IllegalArgumentException("Dia da semana inválido: " + valorBanco);
    }
}
