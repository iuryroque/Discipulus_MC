package com.os.unirios.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor 
@AllArgsConstructor 
@Getter 
@Setter
public class ResourceRequest {
    
    @NotBlank(message = "Caminho do recurso é obrigatório")
    @Size(min = 1, max = 200, message = "Caminho deve ter entre 1 e 200 caracteres")
    private String path;
    
    @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
    private String description;
    
    public ResourceRequest(String path) {
        this.path = path;
    }
} 