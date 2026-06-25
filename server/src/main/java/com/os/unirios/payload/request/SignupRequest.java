package com.os.unirios.payload.request;

import java.util.HashSet;
import java.util.Set;

import com.os.unirios.entities.Profile;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor @AllArgsConstructor @Getter @Setter

public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;
     
   
    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotBlank
    private boolean admin;
    
    private Set<Profile> profiles = new HashSet<Profile>();

    public SignupRequest (String username,String password, boolean admin){
        this.username = username;
        this.password = password;
        this.admin = admin;
    }
   
}
