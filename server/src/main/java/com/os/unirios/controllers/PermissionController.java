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

import com.os.unirios.entities.Permission;
import com.os.unirios.payload.request.PermissionRequest;
import com.os.unirios.services.PermissionService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping(value = "/permission")
public class PermissionController {
    
    @Autowired
    private PermissionService service;
    
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<Page<Permission>> findPage(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "linesPerPage", defaultValue = "24") Integer linesPerPage,
            @RequestParam(value = "orderBy", defaultValue = "id") String orderBy,
            @RequestParam(value = "direction", defaultValue = "ASC") String direction) {
        Page<Permission> list = service.findPage(page, linesPerPage, orderBy, direction);
        return ResponseEntity.ok().body(list);
    }
    
    @GetMapping(value = "/all")
    public ResponseEntity<List<Permission>> findAll() {
        List<Permission> list = service.findAll();
        return ResponseEntity.ok().body(list);
    }
    
    @GetMapping(value = "/{id}")
    public ResponseEntity<Permission> findById(@PathVariable Long id) {
        Permission obj = service.findById(id);
        return ResponseEntity.ok().body(obj);
    }
    
    @GetMapping(value = "/profile/{profileId}")
    public ResponseEntity<List<Permission>> findByProfile(@PathVariable Long profileId) {
        List<Permission> list = service.findByProfile(profileId);
        return ResponseEntity.ok().body(list);
    }
    
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Permission> insert(@Valid @RequestBody PermissionRequest request) {
        Permission permission = service.createPermission(
            request.getProfileId(),
            request.getResourceId(),
            request.isCanGet(),
            request.isCanPost(),
            request.isCanPut(),
            request.isCanDelete()
        );
        
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(permission.getId()).toUri();
        return ResponseEntity.created(uri).body(permission);
    }
    
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Permission> update(@Valid @RequestBody PermissionRequest request, @PathVariable Long id) {
        Permission permission = service.findById(id);
        permission.setCanGet(request.isCanGet());
        permission.setCanPost(request.isCanPost());
        permission.setCanPut(request.isCanPut());
        permission.setCanDelete(request.isCanDelete());
        
        permission = service.update(permission);
        return ResponseEntity.ok().body(permission);
    }
    
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Permission> delete(@PathVariable Long id) {
        Permission obj = service.delete(id);
        return ResponseEntity.ok().body(obj);
    }
} 