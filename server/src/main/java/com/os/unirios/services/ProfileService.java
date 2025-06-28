package com.os.unirios.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

import com.os.unirios.entities.Profile;
import com.os.unirios.repositories.ProfileRepository;
import com.os.unirios.services.exceptions.ObjectNotFoundException;

@Service
public class ProfileService {
    
    @Autowired
    private ProfileRepository repository;
    
    public Profile findById(Long id) {
        Optional<Profile> obj = repository.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException(
            "Objeto não encontrado! Id: " + id + ", Tipo: " + Profile.class.getName()));
    }
    
    public List<Profile> findAll() {
        return repository.findAll();
    }
    
    public Page<Profile> findPage(Integer page, Integer linesPerPage, String orderBy, String direction) {
        PageRequest pageRequest = PageRequest.of(page, linesPerPage, Direction.valueOf(direction), orderBy);
        return repository.findAll(pageRequest);
    }
    
    public Profile insert(Profile obj) {
        obj.setId(null);
        return repository.save(obj);
    }
    
    public Profile update(Profile obj) {
        findById(obj.getId());
        return repository.save(obj);
    }
    
    public Profile delete(Long id) {
        Profile obj = findById(id);
        repository.delete(obj);
        return obj;
    }
    
    public Profile findByName(String name) {
        Optional<Profile> obj = repository.findByName(name);
        return obj.orElseThrow(() -> new ObjectNotFoundException(
            "Perfil não encontrado! Nome: " + name + ", Tipo: " + Profile.class.getName()));
    }
} 