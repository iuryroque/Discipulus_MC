package com.os.unirios.payload.response;

import java.util.HashSet;
import java.util.Set;

import com.os.unirios.entities.Permission;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor 
@AllArgsConstructor 
@Getter 
@Setter
public class ProfileResponse {
    
    private Long id;
    private String name;
    private Set<Permission> permissions = new HashSet<>();
    
    public ProfileResponse(Long id, String name) {
        this.id = id;
        this.name = name;
    }
} 