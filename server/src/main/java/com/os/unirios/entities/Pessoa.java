package com.os.unirios.entities;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.os.unirios.entities.enums.StatusBatismo;
import com.os.unirios.entities.enums.StatusPessoa;
import com.os.unirios.entities.enums.TipoPessoa;
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
@Table(name = "pessoa")
@NoArgsConstructor  @Getter @Setter
@EntityListeners(AuditEventListener.class)
public class Pessoa extends BaseEntity implements Serializable{


private static final long serialVersionUID = 1L;

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name="id")
        private  Long id;

        @Column(name="nome_completo")
        private  String nomeCompleto;
        @Column(name="data_nascimento")
        private  Date dataNascimento;
        @Column(name="telefone")
        private  String telefone;
        @Column(name="email")
        private  String email;
        @Column(name="endereco")
        private  String endereco;
        
        @Enumerated(EnumType.STRING)
        @Column(name="status")
        private  StatusPessoa status;
        
        @Enumerated(EnumType.STRING)
        @Column(name="tipo")
        private  TipoPessoa tipo;
        
        @Enumerated(EnumType.STRING)
        @Column(name="status_batismo")
        private  StatusBatismo statusBatismo;
        
        @Column(name="data_interesse_batismo")
        private  Date dataInteresseBatismo;
        @Column(name="data_batismo")
        private  Date dataBatismo;
        @Column(name="observacoes")
        private  String observacoes;

        @ManyToOne
        @JoinColumn(name="acompanhamento_estudo_id")
        private AcompanhamentoEstudo acompanhamentoEstudo;
        @ManyToOne
        @JoinColumn(name="alertas_id")
        private Alertas alertas;
        @ManyToOne
        @JoinColumn(name="presenca_id")
        @JsonBackReference
        private Presenca presenca;

    public Pessoa  ( Long id ,String nomeCompleto ,Date dataNascimento ,String telefone ,String email ,String endereco ,StatusPessoa status ,TipoPessoa tipo ,StatusBatismo statusBatismo ,Date dataInteresseBatismo ,Date dataBatismo ,String observacoes ){
        
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
