package com.os.unirios.event;

import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.os.unirios.services.AuditService;

import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import jakarta.persistence.PostUpdate;

@Component
public class AuditEventListener {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostPersist
    public void postPersist(Object entity) {
        audit(entity, "INSERT");
    }

    @PostUpdate
    public void postUpdate(Object entity) {
        audit(entity, "UPDATE");
    }

    @PostRemove
    public void postRemove(Object entity) {
        audit(entity, "DELETE");
    }

    @Async("auditTaskExecutor") //configurado em config / AuditConfig.java
    public void audit(Object entity, String operation) {
        String username = getUsername();

        ApplicationContext context = SpringContext.getApplicationContext();
        AuditService auditService = context.getBean(AuditService.class);

        auditService.auditAsync(entity,operation,username);


    }

    private String getUsername() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    
            if (authentication != null && authentication.isAuthenticated()) {
                Object principal = authentication.getPrincipal();
    
                if (principal instanceof UserDetails) {
                    return ((UserDetails) principal).getUsername();
                } else {
                    // Para o caso do 'anonymousUser' que é uma String, ou outros tipos.
                    return principal.toString();
                }
            }
    
            // Se a autenticação for nula ou não estiver autenticada
            return "SYSTEM";
    
        } catch (Exception e) {
            // Logar o erro pode ser útil para depuração futura
            // log.error("Erro ao obter usuário para auditoria", e);
            return "SYSTEM";
        }
    } 
}
