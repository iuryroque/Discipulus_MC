package com.os.unirios.entities.enums;

public enum DiaSemana {
    DOMINGO(1),
    SEGUNDA(2),
    TERCA(3),
    QUARTA(4),
    QUINTA(5),
    SEXTA(6),
    SABADO(7);

    private final int valor;

    DiaSemana(int valor) {
        this.valor = valor;
    }

    public int getValor() {
        return valor;
    }

    public static DiaSemana fromValor(int valor) {
        for (DiaSemana d : DiaSemana.values()) {
            if (d.getValor() == valor) return d;
        }
        throw new IllegalArgumentException("Valor inválido para DiaSemana: " + valor);
    }
} 