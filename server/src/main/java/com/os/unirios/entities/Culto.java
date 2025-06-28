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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
            
@Entity
@Table(name = "CULTO")
@NoArgsConstructor  @Getter @Setter
@EntityListeners(AuditEventListener.class)
public class Culto extends BaseEntity implements Serializable{
            
            
private static final long serialVersionUID = 1L;
            
    
            
                @Id
                @GeneratedValue(strategy = GenerationType.IDENTITY)
                @Column(name="CULTO_ID")
                
            private  Long id;
            @Column(name="CULTO_NOME")
            private  String nome;
            @Column(name="CULTO_TIPO")
            private  String tipo;
            @Column(name="CULTO_DATA HORA")
            private  Date dataHora;
            @Column(name="CULTO_LOCAL")
            private  String local;
            @Column(name="CULTO_DESCRICAO")
            private  String descricao;
    
            @ManyToOne
            @JoinColumn(name="PRESENCA_ID")
            private Presenca presenca;

    public Culto  ( Long id ,String nome ,String tipo ,Date dataHora ,String local ,String descricao ){
        
            this.id = id;
            
            this.nome = nome;
            
            this.tipo = tipo;
            
            this.dataHora = dataHora;
            
            this.local = local;
            
            this.descricao = descricao;
            
    }

    }
