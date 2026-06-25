package com.os.unirios.entities;
import java.io.Serializable;
import java.util.Date;

import com.os.unirios.event.AuditEventListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "FALTA")
@EntityListeners(AuditEventListener.class)
public class Falta extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pessoa_id", nullable = false)
    private Pessoa pessoa;

    @ManyToOne
    @JoinColumn(name = "culto_id", nullable = false)
    private Culto culto;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataFalta;
    
    private String justificativa;

    // Construtores
    public Falta() {
    }

    public Falta(Pessoa pessoa, Culto culto, Date dataFalta) {
        this.pessoa = pessoa;
        this.culto = culto;
        this.dataFalta = dataFalta;
    }

    // Getters e Setters (sem a parte do ID, pois já vem da BaseEntity)
    public Pessoa getPessoa() {
        return pessoa;
    }

    public void setPessoa(Pessoa pessoa) {
        this.pessoa = pessoa;
    }

    public Culto getCulto() {
        return culto;
    }

    public void setCulto(Culto culto) {
        this.culto = culto;
    }

    public Date getDataFalta() {
        return dataFalta;
    }

    public void setDataFalta(Date dataFalta) {
        this.dataFalta = dataFalta;
    }

    public String getJustificativa() {
        return justificativa;
    }

    public void setJustificativa(String justificativa) {
        this.justificativa = justificativa;
    }
}