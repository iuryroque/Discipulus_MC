package com.os.unirios.entities;

import java.io.Serializable;
import java.util.Date;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @CreatedDate
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "criado_em", nullable = false, updatable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date criadoEm;
    
    @LastModifiedDate
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "alterado_em")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date alteradoEm;
    
    @PrePersist
    protected void onCreate() {
        criadoEm = new Date();
        alteradoEm = new Date();
    }
    
    @PreUpdate
    protected void onUpdate() {
        alteradoEm = new Date();
    }
    
    // Getters e Setters
    public Date getCriadoEm() {
        return criadoEm;
    }
    
    public void setCriadoEm(Date criadoEm) {
        this.criadoEm = criadoEm;
    }
    
    public Date getAlteradoEm() {
        return alteradoEm;
    }
    
    public void setAlteradoEm(Date alteradoEm) {
        this.alteradoEm = alteradoEm;
    }
} 