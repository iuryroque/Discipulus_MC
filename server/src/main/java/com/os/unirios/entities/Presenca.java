package com.os.unirios.entities;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
            
@Entity
@Table(name = "PRESENCA")
@NoArgsConstructor  @Getter @Setter
@EntityListeners(AuditEventListener.class)
public class Presenca extends BaseEntity implements Serializable{
            
            
private static final long serialVersionUID = 1L;
            
    
            
                @Id
                @GeneratedValue(strategy = GenerationType.IDENTITY)
                @Column(name="PRESENCA_ID")
                
            private  Long id;
            @Column(name="PRESENCA_PRESENTE")
            private  String presente;
            @Column(name="PRESENCA_OBSERVACOES")
            private  String observacoes;
    
            @ManyToOne
            @JoinColumn(name="PESSOA_ID")
            @JsonManagedReference
            private Pessoa pessoa;

    public Presenca  ( Long id ,String presente ,String observacoes ){
        
            this.id = id;
            
            this.presente = presente;
            
            this.observacoes = observacoes;
            
    }

    }
