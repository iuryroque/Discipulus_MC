package com.os.unirios.entities;

import java.io.Serializable;

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
@Table(name = "LICOES_CURRICULO")
@NoArgsConstructor  @Getter @Setter
@EntityListeners(AuditEventListener.class)
public class LicoesCurriculo extends BaseEntity implements Serializable{
            
private static final long serialVersionUID = 1L;
            
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="LICOES_CURRICULO_ID")
    private Long id;
    
    @Column(name="LICOES_CURRICULO_NUMERO_LICAO")
    private Integer numeroLicao;
    
    @Column(name="LICOES_CURRICULO_TITULO")
    private String titulo;
    
    @Column(name="LICOES_CURRICULO_CONTEUDO")
    private String conteudo;
    
    @Column(name="LICOES_CURRICULO_DURACAO")
    private String duracao;
    
    @Column(name="LICOES_CURRICULO_OBJETIVOS")
    private String objetivos;
    
    @Column(name="LICOES_CURRICULO_MATERIAIS")
    private String materiais;
    
    @Column(name="LICOES_CURRICULO_ORDEM")
    private Integer ordem;
    
    @ManyToOne
    @JoinColumn(name="CURRICULO_ESTUDO_ID")
    @JsonBackReference
    private CurriculoEstudo curriculoEstudo;
    
    @ManyToOne
    @JoinColumn(name="LICOES_CONCLUIDAS_PESSOA_ID")
    private LicoesConcluidasPessoa licoesConcluidasPessoa;

    public LicoesCurriculo(Long id, Integer numeroLicao, String titulo, String conteudo, 
                          String duracao, String objetivos, String materiais, Integer ordem) {
        this.id = id;
        this.numeroLicao = numeroLicao;
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.duracao = duracao;
        this.objetivos = objetivos;
        this.materiais = materiais;
        this.ordem = ordem;
    }
}
