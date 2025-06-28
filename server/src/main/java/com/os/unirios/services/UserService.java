package com.os.unirios.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.os.unirios.entities.User;
import com.os.unirios.repositories.UserRepository;
import com.os.unirios.services.exceptions.DataIntegrityException;
import com.os.unirios.services.exceptions.ObjectNotFoundException;

@Service
public class UserService {
    
    @Autowired
    private UserRepository repository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public User findById(Long id) {
        Optional<User> obj = repository.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException(
            "Objeto não encontrado! Id: " + id + ", Tipo: " + User.class.getName()));
    }
    
    public List<User> findAll() {
        return repository.findAll();
    }
    
    public Page<User> findPage(Integer page, Integer linesPerPage, String orderBy, String direction) {
        PageRequest pageRequest = PageRequest.of(page, linesPerPage, Direction.valueOf(direction), orderBy);
        return repository.findAll(pageRequest);
    }
    
    public User insert(User obj) {
        obj.setId(null);
        if (obj.getPassword() != null) {
            obj.setPassword(passwordEncoder.encode(obj.getPassword()));
        }
        return repository.save(obj);
    }
    
    public User update(User obj) {
        User newObj = findById(obj.getId());
        updateData(newObj, obj);
        return repository.save(newObj);
    }
    
    public User delete(Long id) {
        User obj = findById(id);
        try {
            repository.delete(obj);
        } catch (Exception e) {
            throw new DataIntegrityException("Não é possível excluir um usuário que possui registros associados.");
        }
        return obj;
    }
    
    private void updateData(User newObj, User obj) {
        newObj.setUsername(obj.getUsername());
        newObj.setAdmin(obj.isAdmin());
        newObj.setProfiles(obj.getProfiles());
        if (obj.getPassword() != null && !obj.getPassword().isEmpty()) {
            newObj.setPassword(passwordEncoder.encode(obj.getPassword()));
        }
    }
    
    public User findByUsername(String username) {
        Optional<User> obj = repository.findByUsername(username);
        return obj.orElseThrow(() -> new ObjectNotFoundException(
            "Usuário não encontrado! Username: " + username + ", Tipo: " + User.class.getName()));
    }
    
    public boolean existsByUsername(String username) {
        return repository.existsByUsername(username);
    }
} 