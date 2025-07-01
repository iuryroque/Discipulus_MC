package com.os.unirios.entities.enums;

/**
 * Enum que representa os possíveis status de uma pessoa no sistema
 */
public enum StatusPessoa {
    ATIVO("Ativo"),
    INATIVO("Inativo"),
    PENDENTE("Pendente");

    private final String descricao;

    StatusPessoa(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

    public static StatusPessoa fromString(String text) {
        if (text != null) {
            for (StatusPessoa status : StatusPessoa.values()) {
                if (text.equalsIgnoreCase(status.name()) || text.equalsIgnoreCase(status.descricao)) {
                    return status;
                }
            }
        }
        return null;
    }
} 