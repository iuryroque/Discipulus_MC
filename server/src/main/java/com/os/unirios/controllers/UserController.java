package com.os.unirios.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.os.unirios.entities.User;
import com.os.unirios.payload.request.SignupRequest;
import com.os.unirios.services.UserService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping(value = "/user")
public class UserController {
    
    @Autowired
    private UserService service;
    
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<Page<User>> findPage(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "linesPerPage", defaultValue = "24") Integer linesPerPage,
            @RequestParam(value = "orderBy", defaultValue = "id") String orderBy,
            @RequestParam(value = "direction", defaultValue = "ASC") String direction) {
        Page<User> list = service.findPage(page, linesPerPage, orderBy, direction);
        return ResponseEntity.ok().body(list);
    }
    
    @GetMapping(value = "/all")
    public ResponseEntity<List<User>> findAll() {
        List<User> list = service.findAll();
        return ResponseEntity.ok().body(list);
    }
    
    @GetMapping(value = "/{id}")
    public ResponseEntity<User> findById(@PathVariable Long id) {
        User obj = service.findById(id);
        return ResponseEntity.ok().body(obj);
    }
    
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<User> insert(@Valid @RequestBody SignupRequest request) {
        if (service.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().build();
        }
        
        User user = new User(request.getUsername(), request.getPassword(), request.isAdmin());
        user.setProfiles(request.getProfiles());
        
        user = service.insert(user);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(user.getId()).toUri();
        return ResponseEntity.created(uri).body(user);
    }
    
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<User> update(@Valid @RequestBody SignupRequest request, @PathVariable Long id) {
        User user = service.findById(id);
        user.setUsername(request.getUsername());
        user.setAdmin(request.isAdmin());
        user.setProfiles(request.getProfiles());
        
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(request.getPassword());
        }
        
        user = service.update(user);
        return ResponseEntity.ok().body(user);
    }
    
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<User> delete(@PathVariable Long id) {
        User obj = service.delete(id);
        return ResponseEntity.ok().body(obj);
    }
} 