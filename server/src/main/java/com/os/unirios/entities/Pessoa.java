package com.os.unirios.entities;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
@Table(name = "PESSOA")
@NoArgsConstructor  @Getter @Setter
@EntityListeners(AuditEventListener.class)
public class Pessoa extends BaseEntity implements Serializable{
            
            
private static final long serialVersionUID = 1L;
            
    
            
                @Id
                @GeneratedValue(strategy = GenerationType.IDENTITY)
                @Column(name="PESSOA_ID")
                
            private  Long id;
            @Column(name="PESSOA_NOME COMPLETO")
            private  String nomeCompleto;
            @Column(name="PESSOA_DATA NASCIMENTO")
            private  Date dataNascimento;
            @Column(name="PESSOA_TELEFONE")
            private  String telefone;
            @Column(name="PESSOA_EMAIL")
            private  String email;
            @Column(name="PESSOA_ENDERECO")
            private  String endereco;
            @Column(name="PESSOA_STATUS")
            private  String status;
            @Column(name="PESSOA_TIPO")
            private  String tipo;
            @Column(name="PESSOA_STATUS BATISMO")
            private  String statusBatismo;
            @Column(name="PESSOA_DATA INTERESSE BATISMO")
            private  Date dataInteresseBatismo;
            @Column(name="PESSOA_DATA BATISMO")
            private  Date dataBatismo;
            @Column(name="PESSOA_OBSERVACOES")
            private  String observacoes;
    
            @ManyToOne
            @JoinColumn(name="ACOMPANHAMENTOESTUDO_ID")
            private AcompanhamentoEstudo acompanhamentoEstudo;
            @ManyToOne
            @JoinColumn(name="ALERTAS_ID")
            private Alertas alertas;
            @ManyToOne
            @JoinColumn(name="PRESENCA_ID")
            @JsonBackReference
            private Presenca presenca;

    public Pessoa  ( Long id ,String nomeCompleto ,Date dataNascimento ,String telefone ,String email ,String endereco ,String status ,String tipo ,String statusBatismo ,Date dataInteresseBatismo ,Date dataBatismo ,String observacoes ){
        
            this.id = id;
            
            this.nomeCompleto = nomeCompleto;
            
            this.dataNascimento = dataNascimento;
            
            this.telefone = telefone;
            
            this.email = email;
            
            this.endereco = endereco;
            
            this.status = status;
            
            this.tipo = tipo;
            
            this.statusBatismo = statusBatismo;
            
            this.dataInteresseBatismo = dataInteresseBatismo;
            
            this.dataBatismo = dataBatismo;
            
            this.observacoes = observacoes;
            
    }

    }
