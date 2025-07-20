package com.os.unirios.entities;

import java.io.Serializable;
import java.util.Date;

import com.os.unirios.entities.enums.DiaSemana;
import com.os.unirios.event.AuditEventListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "CULTO_RECORRENTE")
@NoArgsConstructor
@Getter
@Setter
@EntityListeners(AuditEventListener.class)
public class CultoRecorrente extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CULTO_RECORRENTE_ID")
    private Long id;

    @Column(name = "CULTO_RECORRENTE_TITULO")
    private String titulo;

    @Column(name = "CULTO_RECORRENTE_HORA")
    private String hora; // Formato HH:mm

    @Column(name = "CULTO_RECORRENTE_LOCAL")
    private String local;

    @Column(name = "CULTO_RECORRENTE_DESCRICAO")
    private String descricao;

    @Column(name = "CULTO_RECORRENTE_PREGADOR")
    private String pregador;

    @Column(name = "CULTO_RECORRENTE_STATUS")
    private String status;

    @Column(name = "CULTO_RECORRENTE_OBSERVACOES")
    private String observacoes;

    @Enumerated(EnumType.STRING)
    @Column(name = "CULTO_RECORRENTE_DIA_SEMANA")
    private DiaSemana diaSemana;

    @Column(name = "CULTO_RECORRENTE_DATA_INICIO")
    private Date dataInicio;

    @Column(name = "CULTO_RECORRENTE_DATA_FIM", nullable = true)
    private Date dataFim;

    @Column(name = "CULTO_RECORRENTE_ATIVO")
    private Boolean ativo;

    public CultoRecorrente(Long id, String titulo, String hora, String local, 
                          String descricao, String pregador, String status, String observacoes, 
                          DiaSemana diaSemana, Date dataInicio, Date dataFim, Boolean ativo) {
        this.id = id;
        this.titulo = titulo;
        this.hora = hora;
        this.local = local;
        this.descricao = descricao;
        this.pregador = pregador;
        this.status = status;
        this.observacoes = observacoes;
        this.diaSemana = diaSemana;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.ativo = ativo;
    }

    public CultoRecorrente(String titulo, String hora, String local, 
                          String descricao, String pregador, String status, String observacoes, 
                          DiaSemana diaSemana, Date dataInicio, Date dataFim) {
        this.titulo = titulo;
        this.hora = hora;
        this.local = local;
        this.descricao = descricao;
        this.pregador = pregador;
        this.status = status;
        this.observacoes = observacoes;
        this.diaSemana = diaSemana;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.ativo = true;
    }
    
} 