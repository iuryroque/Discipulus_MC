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
@Table(name = "LICOESCURRICULO")
@NoArgsConstructor  @Getter @Setter
@EntityListeners(AuditEventListener.class)
public class LicoesCurriculo extends BaseEntity implements Serializable{
            
private static final long serialVersionUID = 1L;
            
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="LICOESCURRICULO_ID")
    private Long id;
    
    @Column(name="LICOESCURRICULO_NUMERO_LICAO")
    private Integer numeroLicao;
    
    @Column(name="LICOESCURRICULO_TITULO")
    private String titulo;
    
    @Column(name="LICOESCURRICULO_CONTEUDO")
    private String conteudo;
    
    @Column(name="LICOESCURRICULO_DURACAO")
    private String duracao;
    
    @Column(name="LICOESCURRICULO_OBJETIVOS")
    private String objetivos;
    
    @Column(name="LICOESCURRICULO_MATERIAIS")
    private String materiais;
    
    @Column(name="LICOESCURRICULO_ORDEM")
    private Integer ordem;
    
    @ManyToOne
    @JoinColumn(name="CURRICULOESTUDO_ID")
    @JsonBackReference
    private CurriculoEstudo curriculoEstudo;
    
    @ManyToOne
    @JoinColumn(name="LICOESCONCLUIDASPESSOA_ID")
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
