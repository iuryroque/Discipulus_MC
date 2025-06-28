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
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
            
@Entity
@Table(name = "LICOESCONCLUIDASPESSOA")
@NoArgsConstructor  @Getter @Setter
@EntityListeners(AuditEventListener.class)
public class LicoesConcluidasPessoa  implements Serializable{
            
            
private static final long serialVersionUID = 1L;
            
    
            
                @Id
                @GeneratedValue(strategy = GenerationType.IDENTITY)
                @Column(name="LICOESCONCLUIDASPESSOA_ID")
                
            private  Long id;
            @Column(name="LICOESCONCLUIDASPESSOA_DATA CONCLUSAO")
            private  Date dataConclusao;
            @Column(name="LICOESCONCLUIDASPESSOA_OBSERVACOES")
            private  String observacoes;
            @Column(name="LICOESCONCLUIDASPESSOA_CRIADO EM")
            private  Date criadoEm;
            @Column(name="LICOESCONCLUIDASPESSOA_ATUALIZADO EM")
            private  Date atualizadoEm;
    

    public LicoesConcluidasPessoa  ( Long id ,Date dataConclusao ,String observacoes ,Date criadoEm ,Date atualizadoEm ){
        
            this.id = id;
            
            this.dataConclusao = dataConclusao;
            
            this.observacoes = observacoes;
            
            this.criadoEm = criadoEm;
            
            this.atualizadoEm = atualizadoEm;
            
    }

    }
