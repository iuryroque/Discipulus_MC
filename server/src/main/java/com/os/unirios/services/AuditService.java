package com.os.unirios.services;



import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.os.unirios.entities.AuditLog;
import com.os.unirios.repositories.AuditLogRepository;

import jakarta.persistence.Id;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

     public void logAudit(String username, String changes,String operation,String entityName,String entityId) {

        AuditLog auditLog = new AuditLog();
        auditLog.setUsername(username);
        auditLog.setOperation(operation);
        auditLog.setEntityName(entityName);
        auditLog.setEntityId(entityId);
        auditLog.setTimestamp(LocalDateTime.now());
        auditLog.setChanges(changes);
        auditLogRepository.save(auditLog);
    }

    @Async("auditTaskExecutor") //configurado em config / AuditConfig.java
    public void auditAsync(Object entity, String operation,String username) {
        
        Map<String, Object> changes = new HashMap<>();
        
        String entityId = null;

        for (Field field : entity.getClass().getDeclaredFields()) {
            field.setAccessible(true);
            try {

                Object value = field.get(entity);
                
                if (field.isAnnotationPresent(Id.class)) {
                    entityId = value.toString();
                }

                changes.put(field.getName(), value);
               
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }

         String jsonChanges;
        try {
            jsonChanges = objectMapper.writeValueAsString(changes);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            jsonChanges = "{}"; // Fallback para um JSON vazio em caso de erro
        }

     

       

        logAudit(username, jsonChanges, operation, entity.getClass().getSimpleName(),entityId);


    }

   
}
