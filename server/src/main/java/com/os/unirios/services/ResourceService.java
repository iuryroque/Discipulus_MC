package com.os.unirios.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

import com.os.unirios.entities.Resource;
import com.os.unirios.repositories.ResourceRepository;
import com.os.unirios.services.exceptions.ObjectNotFoundException;

@Service
public class ResourceService {
    
    @Autowired
    private ResourceRepository repository;
    
    public Resource findById(Long id) {
        Optional<Resource> obj = repository.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException(
            "Objeto não encontrado! Id: " + id + ", Tipo: " + Resource.class.getName()));
    }
    
    public List<Resource> findAll() {
        return repository.findAll();
    }
    
    public Page<Resource> findPage(Integer page, Integer linesPerPage, String orderBy, String direction) {
        PageRequest pageRequest = PageRequest.of(page, linesPerPage, Direction.valueOf(direction), orderBy);
        return repository.findAll(pageRequest);
    }
    
    public Resource insert(Resource obj) {
        obj.setId(null);
        return repository.save(obj);
    }
    
    public Resource update(Resource obj) {
        findById(obj.getId());
        return repository.save(obj);
    }
    
    public Resource delete(Long id) {
        Resource obj = findById(id);
        repository.delete(obj);
        return obj;
    }
    
    public Resource findByPath(String path) {
        Optional<Resource> obj = repository.findByPath(path);
        return obj.orElseThrow(() -> new ObjectNotFoundException(
            "Recurso não encontrado! Path: " + path + ", Tipo: " + Resource.class.getName()));
    }
} 