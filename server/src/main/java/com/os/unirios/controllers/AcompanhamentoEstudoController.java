
package com.os.unirios.controllers;

import java.net.URI;
import java.util.List;
import java.util.ArrayList;

import com.os.unirios.entities.AcompanhamentoEstudo;
import com.os.unirios.services.AcompanhamentoEstudoService;
    
    
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping(value="/acompanhamentoEstudo")
public class AcompanhamentoEstudoController {
        
    @Autowired
    private AcompanhamentoEstudoService service;
    
    @RequestMapping( method = RequestMethod.GET)
	public ResponseEntity<Page<AcompanhamentoEstudo>> findPage(
			@RequestParam(value = "page", defaultValue = "0") Integer page,
			@RequestParam(value = "linesPerPage", defaultValue = "24") Integer linesPerPage,
			@RequestParam(value = "orderBy", defaultValue = "id") String orderBy,
			@RequestParam(value = "direction", defaultValue = "ASC") String direction,
			@RequestParam(value = "filter", defaultValue = "") String filter) {
		Page<AcompanhamentoEstudo> list = service.findPageWithFilters(page, linesPerPage, orderBy, direction, filter);  
		return ResponseEntity.ok().body(list);
	}
    
    @GetMapping(value = "/all")
    public ResponseEntity<List<AcompanhamentoEstudo>> findAl(){
        List<AcompanhamentoEstudo> list = service.findAll();
        return ResponseEntity.ok().body(list);
    }
    
    @GetMapping(value = "/{id}")
    public ResponseEntity<AcompanhamentoEstudo> findById (@PathVariable long id){
        AcompanhamentoEstudo obj = service.findById(id);
        return ResponseEntity.ok().body(obj);
    }
    
    @RequestMapping(method=RequestMethod.POST)
    public ResponseEntity<AcompanhamentoEstudo> insert( @RequestBody AcompanhamentoEstudo obj) {
        obj = service.insert(obj);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}").buildAndExpand(obj.getId()).toUri();
        return ResponseEntity.created(uri).body(obj);
    }
    
    @RequestMapping(value="/{id}", method=RequestMethod.PUT)
    public ResponseEntity<AcompanhamentoEstudo> update( @RequestBody AcompanhamentoEstudo obj, @PathVariable Long id) {
        obj.setId(id);
        obj = service.update(obj);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}").buildAndExpand(obj.getId()).toUri();
        return ResponseEntity.created(uri).body(obj);
    }
        
    @RequestMapping(value="/{id}", method=RequestMethod.DELETE)
    public ResponseEntity<AcompanhamentoEstudo> delete(@PathVariable Long id) {
        AcompanhamentoEstudo obj = service.delete(id);
        return ResponseEntity.ok().body(obj);
    }

    @RequestMapping(value="/many/{ids}", method=RequestMethod.GET)
	public ResponseEntity<List<AcompanhamentoEstudo>> findMany(@PathVariable Long[] ids) {
		List<AcompanhamentoEstudo> list = new ArrayList<AcompanhamentoEstudo>();
		
		for(Long id: ids) {
			AcompanhamentoEstudo acompanhamentoEstudo = service.findById(id);
			list.add(acompanhamentoEstudo);
		}
		
		return ResponseEntity.ok().body(list);
	}
    
    @RequestMapping(value="/many/{ids}", method=RequestMethod.DELETE)
	public ResponseEntity<Long[]> delete(@PathVariable Long[] ids) {
		
		for(Long id: ids) {
			service.delete(id);
		}
		Long[] vars = ids;
		return ResponseEntity.ok().body(vars);
	}

        
}
