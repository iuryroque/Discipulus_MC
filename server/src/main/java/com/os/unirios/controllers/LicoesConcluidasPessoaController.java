
package com.os.unirios.controllers;

import java.net.URI;
import java.util.ArrayList;
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

import com.os.unirios.entities.LicoesConcluidasPessoa;
import com.os.unirios.services.LicoesConcluidasPessoaService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping(value="/licoes_concluidas_pessoa")
public class LicoesConcluidasPessoaController {
        
    @Autowired
    private LicoesConcluidasPessoaService service;
    
    @RequestMapping( method = RequestMethod.GET)
	public ResponseEntity<Page<LicoesConcluidasPessoa>> findPage(
			@RequestParam(value = "page", defaultValue = "0") Integer page,
			@RequestParam(value = "linesPerPage", defaultValue = "24") Integer linesPerPage,
			@RequestParam(value = "orderBy", defaultValue = "id") String orderBy,
			@RequestParam(value = "direction", defaultValue = "ASC") String direction,
			@RequestParam(value = "filter", defaultValue = "") String filter) {
		Page<LicoesConcluidasPessoa> list = service.findPageWithFilters(page, linesPerPage, orderBy, direction, filter);  
		return ResponseEntity.ok().body(list);
	}
    
    @GetMapping(value = "/all")
    public ResponseEntity<List<LicoesConcluidasPessoa>> findAl(){
        List<LicoesConcluidasPessoa> list = service.findAll();
        return ResponseEntity.ok().body(list);
    }
    
    @GetMapping(value = "/{id}")
    public ResponseEntity<LicoesConcluidasPessoa> findById (@PathVariable long id){
        LicoesConcluidasPessoa obj = service.findById(id);
        return ResponseEntity.ok().body(obj);
    }
    
    @RequestMapping(method=RequestMethod.POST)
    public ResponseEntity<LicoesConcluidasPessoa> insert( @RequestBody LicoesConcluidasPessoa obj) {
        obj = service.insert(obj);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}").buildAndExpand(obj.getId()).toUri();
        return ResponseEntity.created(uri).body(obj);
    }
    
    @RequestMapping(value="/{id}", method=RequestMethod.PUT)
    public ResponseEntity<LicoesConcluidasPessoa> update( @RequestBody LicoesConcluidasPessoa obj, @PathVariable Long id) {
        obj.setId(id);
        obj = service.update(obj);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}").buildAndExpand(obj.getId()).toUri();
        return ResponseEntity.created(uri).body(obj);
    }
        
    @RequestMapping(value="/{id}", method=RequestMethod.DELETE)
    public ResponseEntity<LicoesConcluidasPessoa> delete(@PathVariable Long id) {
        LicoesConcluidasPessoa obj = service.delete(id);
        return ResponseEntity.ok().body(obj);
    }

    @RequestMapping(value="/many/{ids}", method=RequestMethod.GET)
	public ResponseEntity<List<LicoesConcluidasPessoa>> findMany(@PathVariable Long[] ids) {
		List<LicoesConcluidasPessoa> list = new ArrayList<LicoesConcluidasPessoa>();
		
		for(Long id: ids) {
			LicoesConcluidasPessoa licoesConcluidasPessoa = service.findById(id);
			list.add(licoesConcluidasPessoa);
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
