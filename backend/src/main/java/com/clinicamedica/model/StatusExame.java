package com.clinicamedica.model;

public enum StatusExame {
    SOLICITADO("Solicitado"),
    CANCELADO("Cancelado"),
    LAUDO_ANEXADO("Laudo Anexado"),
    CONCLUIDO("Concluído");

    private final String valorBanco;

    StatusExame(String valorBanco) {
        this.valorBanco = valorBanco;
    }

    public String getValorBanco() {
        return valorBanco;
    }

    public static StatusExame fromValorBanco(String valorBanco) {
        for (StatusExame status : StatusExame.values()) {
            if (status.valorBanco.equalsIgnoreCase(valorBanco) || status.name().equalsIgnoreCase(valorBanco)) {
                return status;
            }
        }

        throw new IllegalArgumentException("Status de exame inválido: " + valorBanco);
    }
}
