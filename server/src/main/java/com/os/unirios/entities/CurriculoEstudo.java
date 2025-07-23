package com.os.unirios.entities;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.os.unirios.event.AuditEventListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
            
@Entity
@Table(name = "CURRICULO_ESTUDO")
@NoArgsConstructor  @Getter @Setter
@EntityListeners(AuditEventListener.class)
public class CurriculoEstudo extends BaseEntity implements Serializable{
            
private static final long serialVersionUID = 1L;
            
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="CURRICULO_ESTUDO_ID")
    private Long id;
    
    @Column(name="CURRICULO_ESTUDO_NOME")
    private String nome;
    
    @Column(name="CURRICULO_ESTUDO_DESCRICAO")
    private String descricao;
    
    @Column(name="CURRICULO_ESTUDO_OBJETIVOS")
    private String objetivos;
    
    @Column(name="CURRICULO_ESTUDO_DURACAO")
    private String duracao;
    
    @Column(name="CURRICULO_ESTUDO_NIVEL")
    private String nivel;
    
    @Column(name="CURRICULO_ESTUDO_STATUS")
    private String status;
    
    @Column(name="CURRICULO_ESTUDO_OBSERVACOES")
    private String observacoes;
    
    @OneToOne()
    @JoinColumn(name="ACOMPANHAMENTO_ESTUDO_ID")
    private AcompanhamentoEstudo acompanhamentoEstudo;
    
    @OneToMany(mappedBy = "curriculoEstudo")
    @JsonManagedReference
    private List<LicoesCurriculo> licoes = new ArrayList<>();

    public CurriculoEstudo(Long id, String nome, String descricao, String objetivos, 
                          String duracao, String nivel, String status, String observacoes) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.objetivos = objetivos;
        this.duracao = duracao;
        this.nivel = nivel;
        this.status = status;
        this.observacoes = observacoes;
    }
}
