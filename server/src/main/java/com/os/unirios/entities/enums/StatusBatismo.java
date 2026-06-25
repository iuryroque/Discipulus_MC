package com.os.unirios.entities.enums;

/**
 * Enum que representa os possíveis status de batismo de uma pessoa
 */
public enum StatusBatismo {
    BATIZADO("Batizado"),
    NAO_BATIZADO("Não Batizado"),
    INTERESSADO("Interessado");

    private final String descricao;

    StatusBatismo(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

    public static StatusBatismo fromString(String text) {
        if (text != null) {
            for (StatusBatismo status : StatusBatismo.values()) {
                if (text.equalsIgnoreCase(status.name()) || text.equalsIgnoreCase(status.descricao)) {
                    return status;
                }
            }
        }
        return null;
    }
} 