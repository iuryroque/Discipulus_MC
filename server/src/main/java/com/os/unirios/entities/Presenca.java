package com.os.unirios.entities;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.os.unirios.entities.enums.StatusPresenca;
import com.os.unirios.event.AuditEventListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
            
@Entity
@Table(name = "presenca")
@NoArgsConstructor  @Getter @Setter
@EntityListeners(AuditEventListener.class)
public class Presenca extends BaseEntity implements Serializable{
            
            
private static final long serialVersionUID = 1L;
            
    
            
                @Id
                @GeneratedValue(strategy = GenerationType.IDENTITY)
                @Column(name="id")
                
            private  Long id;
            @Enumerated(EnumType.STRING)
            @Column(name="presente", nullable = false)
            private StatusPresenca presente;
            @Column(name="observacoes")
            private  String observacoes;
    
            @ManyToOne
            @JoinColumn(name="pessoa_id")
            @JsonManagedReference
            private Pessoa pessoa;

            @ManyToOne
            @JoinColumn(name="culto_id")
            private Culto culto;

    public Presenca(Long id, StatusPresenca presente, String observacoes) {
        this.id = id;
        this.presente = presente;
        this.observacoes = observacoes;
    }

    public StatusPresenca getPresente() {
        return presente;
    }
    public void setPresente(StatusPresenca presente) {
        this.presente = presente;
    }

    }
