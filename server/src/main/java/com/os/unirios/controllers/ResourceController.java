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

import com.os.unirios.entities.Resource;
import com.os.unirios.payload.request.ResourceRequest;
import com.os.unirios.services.ResourceService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping(value = "/resource")
public class ResourceController {
    
    @Autowired
    private ResourceService service;
    
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<Page<Resource>> findPage(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "linesPerPage", defaultValue = "24") Integer linesPerPage,
            @RequestParam(value = "orderBy", defaultValue = "id") String orderBy,
            @RequestParam(value = "direction", defaultValue = "ASC") String direction) {
        Page<Resource> list = service.findPage(page, linesPerPage, orderBy, direction);
        return ResponseEntity.ok().body(list);
    }
    
    @GetMapping(value = "/all")
    public ResponseEntity<List<Resource>> findAll() {
        List<Resource> list = service.findAll();
        return ResponseEntity.ok().body(list);
    }
    
    @GetMapping(value = "/{id}")
    public ResponseEntity<Resource> findById(@PathVariable Long id) {
        Resource obj = service.findById(id);
        return ResponseEntity.ok().body(obj);
    }
    
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Resource> insert(@Valid @RequestBody ResourceRequest request) {
        Resource resource = new Resource();
        resource.setPath(request.getPath());
        resource.setDescription(request.getDescription());
        
        resource = service.insert(resource);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(resource.getId()).toUri();
        return ResponseEntity.created(uri).body(resource);
    }
    
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Resource> update(@Valid @RequestBody ResourceRequest request, @PathVariable Long id) {
        Resource resource = service.findById(id);
        resource.setPath(request.getPath());
        resource.setDescription(request.getDescription());
        
        resource = service.update(resource);
        return ResponseEntity.ok().body(resource);
    }
    
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Resource> delete(@PathVariable Long id) {
        Resource obj = service.delete(id);
        return ResponseEntity.ok().body(obj);
    }
} 