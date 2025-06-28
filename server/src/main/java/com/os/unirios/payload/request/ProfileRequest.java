package com.os.unirios.payload.request;

import java.util.HashSet;
import java.util.Set;

import com.os.unirios.entities.Permission;

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
public class ProfileRequest {
    
    @NotBlank(message = "Nome do perfil é obrigatório")
    @Size(min = 2, max = 50, message = "Nome deve ter entre 2 e 50 caracteres")
    private String name;
    
    private Set<Permission> permissions = new HashSet<>();
    
    public ProfileRequest(String name) {
        this.name = name;
    }
}
