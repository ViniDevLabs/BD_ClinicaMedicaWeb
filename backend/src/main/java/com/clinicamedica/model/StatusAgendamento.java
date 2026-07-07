package com.clinicamedica.model;

public enum StatusAgendamento {
    AGENDADO("Agendado"),
    CANCELADO("Cancelado"),
    CONFIRMADO("Confirmado"),
    REALIZADO("Realizado");

    private final String valorBanco;

    StatusAgendamento(String valorBanco) {
        this.valorBanco = valorBanco;
    }

    public String getValorBanco() {
        return valorBanco;
    }

    public static StatusAgendamento fromValorBanco(String valorBanco) {
        for (StatusAgendamento status : StatusAgendamento.values()) {
            if (status.valorBanco.equalsIgnoreCase(valorBanco) || status.name().equalsIgnoreCase(valorBanco)) {
                return status;
            }
        }

        throw new IllegalArgumentException("Status de agendamento inválido: " + valorBanco);
    }
}
