package com.clinicamedica.model;

public enum LocalRealizacaoExame {
    INTERNO("Interno"),
    EXTERNO("Externo");

    private final String valorBanco;

    LocalRealizacaoExame(String valorBanco) {
        this.valorBanco = valorBanco;
    }

    public String getValorBanco() {
        return valorBanco;
    }

    public static LocalRealizacaoExame fromValorBanco(String valorBanco) {
        for (LocalRealizacaoExame local : LocalRealizacaoExame.values()) {
            if (local.valorBanco.equalsIgnoreCase(valorBanco) || local.name().equalsIgnoreCase(valorBanco)) {
                return local;
            }
        }

        throw new IllegalArgumentException("Local de realização de exame inválido: " + valorBanco);
    }
}
