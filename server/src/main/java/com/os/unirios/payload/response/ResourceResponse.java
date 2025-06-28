package com.os.unirios.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor 
@AllArgsConstructor 
@Getter 
@Setter
public class ResourceResponse {
    
    private Long id;
    private String path;
    private String description;
    
    public ResourceResponse(Long id, String path) {
        this.id = id;
        this.path = path;
    }
} 