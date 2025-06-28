package com.os.unirios.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

import com.os.unirios.entities.Permission;
import com.os.unirios.entities.Profile;
import com.os.unirios.entities.Resource;
import com.os.unirios.repositories.PermissionRepository;
import com.os.unirios.services.exceptions.ObjectNotFoundException;

@Service
public class PermissionService {
    
    @Autowired
    private PermissionRepository repository;
    
    @Autowired
    private ProfileService profileService;
    
    @Autowired
    private ResourceService resourceService;
    
    public Permission findById(Long id) {
        Optional<Permission> obj = repository.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException(
            "Objeto não encontrado! Id: " + id + ", Tipo: " + Permission.class.getName()));
    }
    
    public List<Permission> findAll() {
        return repository.findAll();
    }
    
    public Page<Permission> findPage(Integer page, Integer linesPerPage, String orderBy, String direction) {
        PageRequest pageRequest = PageRequest.of(page, linesPerPage, Direction.valueOf(direction), orderBy);
        return repository.findAll(pageRequest);
    }
    
    public Permission insert(Permission obj) {
        obj.setId(null);
        return repository.save(obj);
    }
    
    public Permission update(Permission obj) {
        findById(obj.getId());
        return repository.save(obj);
    }
    
    public Permission delete(Long id) {
        Permission obj = findById(id);
        repository.delete(obj);
        return obj;
    }
    
    public List<Permission> findByProfile(Long profileId) {
        Profile profile = profileService.findById(profileId);
        return repository.findAll().stream()
            .filter(p -> p.getProfile().getId().equals(profileId))
            .toList();
    }
    
    public Permission createPermission(Long profileId, Long resourceId, boolean canGet, boolean canPost, boolean canPut, boolean canDelete) {
        Profile profile = profileService.findById(profileId);
        Resource resource = resourceService.findById(resourceId);
        
        Permission permission = new Permission();
        permission.setProfile(profile);
        permission.setResource(resource);
        permission.setCanGet(canGet);
        permission.setCanPost(canPost);
        permission.setCanPut(canPut);
        permission.setCanDelete(canDelete);
        
        return repository.save(permission);
    }
} 