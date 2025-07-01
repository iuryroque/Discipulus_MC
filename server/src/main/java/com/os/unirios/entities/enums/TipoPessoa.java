package com.os.unirios.entities.enums;

/**
 * Enum que representa os possíveis tipos de uma pessoa no sistema
 */
public enum TipoPessoa {
    MEMBRO("Membro"),
    VISITANTE("Visitante"),
    CONGREGADO("Congregado"),
    INTERESSADO("Interessado");

    private final String descricao;

    TipoPessoa(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

    public static TipoPessoa fromString(String text) {
        if (text != null) {
            for (TipoPessoa tipo : TipoPessoa.values()) {
                if (text.equalsIgnoreCase(tipo.name()) || text.equalsIgnoreCase(tipo.descricao)) {
                    return tipo;
                }
            }
        }
        return null;
    }
} 