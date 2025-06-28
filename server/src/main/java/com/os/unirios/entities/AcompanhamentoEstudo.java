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
@Table(name = "ACOMPANHAMENTOESTUDO")
@NoArgsConstructor  @Getter @Setter
@EntityListeners(AuditEventListener.class)
public class AcompanhamentoEstudo  implements Serializable{
            
            
private static final long serialVersionUID = 1L;
            
    
            
                @Id
                @GeneratedValue(strategy = GenerationType.IDENTITY)
                @Column(name="ACOMPANHAMENTOESTUDO_ID")
                
            private  Long id;
            @Column(name="ACOMPANHAMENTOESTUDO_STATUS")
            private  String status;
            @Column(name="ACOMPANHAMENTOESTUDO_DATA INICIO")
            private  Date dataInicio;
            @Column(name="ACOMPANHAMENTOESTUDO_DATA CONCLUSAO")
            private  Date dataConclusao;
            @Column(name="ACOMPANHAMENTOESTUDO_CRIADO EM")
            private  Date criadoEm;
            @Column(name="ACOMPANHAMENTOESTUDO_ALTERADO EM")
            private  Date alteradoEm;
    
            @ManyToOne
            @JoinColumn(name="LICOESCONCLUIDASPESSOA_ID")
            private LicoesConcluidasPessoa licoesConcluidasPessoa;

    public AcompanhamentoEstudo  ( Long id ,String status ,Date dataInicio ,Date dataConclusao ,Date criadoEm ,Date alteradoEm ){
        
            this.id = id;
            
            this.status = status;
            
            this.dataInicio = dataInicio;
            
            this.dataConclusao = dataConclusao;
            
            this.criadoEm = criadoEm;
            
            this.alteradoEm = alteradoEm;
            
    }

    }
