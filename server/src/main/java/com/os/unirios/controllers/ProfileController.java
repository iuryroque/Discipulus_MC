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

import com.os.unirios.entities.Profile;
import com.os.unirios.payload.request.ProfileRequest;
import com.os.unirios.services.ProfileService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping(value = "/profile")
public class ProfileController {
    
    @Autowired
    private ProfileService service;
    
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<Page<Profile>> findPage(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "linesPerPage", defaultValue = "24") Integer linesPerPage,
            @RequestParam(value = "orderBy", defaultValue = "id") String orderBy,
            @RequestParam(value = "direction", defaultValue = "ASC") String direction) {
        Page<Profile> list = service.findPage(page, linesPerPage, orderBy, direction);
        return ResponseEntity.ok().body(list);
    }
    
    @GetMapping(value = "/all")
    public ResponseEntity<List<Profile>> findAll() {
        List<Profile> list = service.findAll();
        return ResponseEntity.ok().body(list);
    }
    
    @GetMapping(value = "/{id}")
    public ResponseEntity<Profile> findById(@PathVariable Long id) {
        Profile obj = service.findById(id);
        return ResponseEntity.ok().body(obj);
    }
    
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Profile> insert(@Valid @RequestBody ProfileRequest request) {
        Profile profile = new Profile();
        profile.setName(request.getName());
        profile.setPermissions(request.getPermissions());
        
        profile = service.insert(profile);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(profile.getId()).toUri();
        return ResponseEntity.created(uri).body(profile);
    }
    
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Profile> update(@Valid @RequestBody ProfileRequest request, @PathVariable Long id) {
        Profile profile = service.findById(id);
        profile.setName(request.getName());
        profile.setPermissions(request.getPermissions());
        
        profile = service.update(profile);
        return ResponseEntity.ok().body(profile);
    }
    
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Profile> delete(@PathVariable Long id) {
        Profile obj = service.delete(id);
        return ResponseEntity.ok().body(obj);
    }
} 