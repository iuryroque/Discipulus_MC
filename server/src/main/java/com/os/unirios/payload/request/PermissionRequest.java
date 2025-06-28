package com.os.unirios.payload.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor 
@AllArgsConstructor 
@Getter 
@Setter
public class PermissionRequest {
    
    @NotNull(message = "ID do perfil é obrigatório")
    private Long profileId;
    
    @NotNull(message = "ID do recurso é obrigatório")
    private Long resourceId;
    
    private boolean canGet = false;
    private boolean canPost = false;
    private boolean canPut = false;
    private boolean canDelete = false;
} 