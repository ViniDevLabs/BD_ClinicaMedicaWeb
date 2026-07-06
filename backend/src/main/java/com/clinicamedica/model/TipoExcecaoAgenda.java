package com.clinicamedica.model;

public enum TipoExcecaoAgenda {
    BLOQUEIO("Bloqueio"),
    ADICAO("Adição");

    private final String valorBanco;

    TipoExcecaoAgenda(String valorBanco) {
        this.valorBanco = valorBanco;
    }

    public String getValorBanco() {
        return valorBanco;
    }

    public static TipoExcecaoAgenda fromValorBanco(String valorBanco) {
        for (TipoExcecaoAgenda tipo : TipoExcecaoAgenda.values()) {
            if (tipo.valorBanco.equalsIgnoreCase(valorBanco) || tipo.name().equalsIgnoreCase(valorBanco)) {
                return tipo;
            }
        }

        throw new IllegalArgumentException("Tipo de exceção de agenda inválido: " + valorBanco);
    }
}
