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
@Table(name = "ALERTAS")
@NoArgsConstructor  @Getter @Setter
@EntityListeners(AuditEventListener.class)
public class Alertas  implements Serializable{
            
            
private static final long serialVersionUID = 1L;
            
    
            
                @Id
                @GeneratedValue(strategy = GenerationType.IDENTITY)
                @Column(name="ALERTAS_ID")
                
            private  Long id;
            @Column(name="ALERTAS_TIPO")
            private  String tipo;
            @Column(name="ALERTAS_TITULO")
            private  String titulo;
            @Column(name="ALERTAS_MENSAGEM")
            private  String mensagem;
            @Column(name="ALERTAS_RESOLVIDO")
            private  String resolvido;
            @Column(name="ALERTAS_DATA ALERTA")
            private  Date dataAlerta;
            @Column(name="ALERTAS_DATA RESOLUCAO")
            private  Date dataResolucao;
            @Column(name="ALERTAS_CRIADO EM")
            private  Date criadoEm;
            @Column(name="ALERTAS_ALTERADO EM")
            private  Date alteradoEm;
    

    public Alertas  ( Long id ,String titulo ,String descricao ,String tipo ,String prioridade ,String status ,Date dataAlerta ,Date dataResolucao ,Date criadoEm ,Date alteradoEm ){
        
            this.id = id;
            
            this.titulo = titulo;
            
            this.mensagem = descricao;
            
            this.tipo = tipo;
            
            this.resolvido = prioridade;
            
            this.dataAlerta = dataAlerta;
            
            this.dataResolucao = dataResolucao;
            
            this.criadoEm = criadoEm;
            
            this.alteradoEm = alteradoEm;
            
    }

    }
