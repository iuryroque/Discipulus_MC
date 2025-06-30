package com.os.unirios.controllers;

import java.net.URI;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

import com.os.unirios.entities.Pessoa;
import com.os.unirios.payload.response.PessoaCardResponse;
import com.os.unirios.services.PessoaService;
import com.os.unirios.entities.Presenca;
import com.os.unirios.entities.Culto;
import com.os.unirios.repositories.PresencaRepository;
import com.os.unirios.repositories.CultoRepository;
    
    
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
@RequestMapping(value="/pessoa")
public class PessoaController {
        
    @Autowired
    private PessoaService service;
    
    @Autowired
    private PresencaRepository presencaRepository;
    
    @Autowired
    private CultoRepository cultoRepository;
    
    @RequestMapping( method = RequestMethod.GET)
	public ResponseEntity<Page<Pessoa>> findPage(
			@RequestParam(value = "page", defaultValue = "0") Integer page,
			@RequestParam(value = "linesPerPage", defaultValue = "24") Integer linesPerPage,
			@RequestParam(value = "orderBy", defaultValue = "id") String orderBy,
			@RequestParam(value = "direction", defaultValue = "ASC") String direction,
			@RequestParam(value = "filter", defaultValue = "") String filter) {
		Page<Pessoa> list = service.findPageWithFilters(page, linesPerPage, orderBy, direction, filter);  
		return ResponseEntity.ok().body(list);
	}
    
    @GetMapping(value = "/all")
    public ResponseEntity<List<Pessoa>> findAl(){
        List<Pessoa> list = service.findAll();
        return ResponseEntity.ok().body(list);
    }
    
    @GetMapping(value = "/cards")
    public Map<String, Object> getPessoasCards() {
        List<Pessoa> pessoas = service.findAll();
        List<PessoaCardResponse> cards = pessoas.stream()
            .map(pessoa -> {
                PessoaCardResponse card = new PessoaCardResponse();
                card.setId(pessoa.getId());
                card.setNomeCompleto(pessoa.getNomeCompleto());
                card.setTipo(pessoa.getTipo());
                card.setStatus(pessoa.getStatus());
                card.setTelefone(pessoa.getTelefone());
                card.setEmail(pessoa.getEmail());
                
                // Buscar último culto
                List<Presenca> presencas = presencaRepository.findByPessoaOrderByCriadoEmDesc(pessoa);
                if (!presencas.isEmpty()) {
                    Presenca ultimaPresenca = presencas.get(0);
                    List<Culto> cultos = cultoRepository.findByPresenca(ultimaPresenca);
                    if (!cultos.isEmpty()) {
                        Culto ultimoCulto = cultos.get(0);
                        card.setUltimoCultoNome(ultimoCulto.getNome());
                        card.setUltimoCultoData(ultimoCulto.getDataHora());
                    }
                }
                
                // Progresso de estudo
                if (pessoa.getAcompanhamentoEstudo() != null) {
                    card.setStatusAcompanhamento(pessoa.getAcompanhamentoEstudo().getStatus());
                    card.setCurriculoEstudoNome("Acompanhamento Ativo");
                    card.setLicaoAtual(0);
                    card.setTotalLicoes(0);
                } else {
                    card.setStatusAcompanhamento("Sem acompanhamento");
                    card.setCurriculoEstudoNome("N/A");
                    card.setLicaoAtual(0);
                    card.setTotalLicoes(0);
                }
                
                // Status de alerta
                if (pessoa.getAlertas() != null) {
                    card.setTemAlertaAtivo("N".equals(pessoa.getAlertas().getResolvido()));
                    card.setTipoAlerta(pessoa.getAlertas().getTipo());
                    card.setDataUltimoAlerta(pessoa.getAlertas().getDataAlerta());
                } else {
                    card.setTemAlertaAtivo(false);
                    card.setTipoAlerta("N/A");
                    card.setDataUltimoAlerta(null);
                }
                
                // Último contato
                card.setDataUltimoContato(pessoa.getCriadoEm());
                
                return card;
            })
            .collect(Collectors.toList());
        Map<String, Object> result = new HashMap<>();
        result.put("data", cards);
        result.put("total", cards.size());
        return result;
    }
    
    @GetMapping(value = "/{id}")
    public ResponseEntity<Pessoa> findById (@PathVariable long id){
        Pessoa obj = service.findById(id);
        return ResponseEntity.ok().body(obj);
    }
    
    @RequestMapping(method=RequestMethod.POST)
    public ResponseEntity<Pessoa> insert( @RequestBody Pessoa obj) {
        obj = service.insert(obj);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}").buildAndExpand(obj.getId()).toUri();
        return ResponseEntity.created(uri).body(obj);
    }
    
    @RequestMapping(value="/{id}", method=RequestMethod.PUT)
    public ResponseEntity<Pessoa> update( @RequestBody Pessoa obj, @PathVariable Long id) {
        obj.setId(id);
        obj = service.update(obj);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}").buildAndExpand(obj.getId()).toUri();
        return ResponseEntity.created(uri).body(obj);
    }
        
    @RequestMapping(value="/{id}", method=RequestMethod.DELETE)
    public ResponseEntity<Pessoa> delete(@PathVariable Long id) {
        Pessoa obj = service.delete(id);
        return ResponseEntity.ok().body(obj);
    }

    @RequestMapping(value="/many/{ids}", method=RequestMethod.GET)
	public ResponseEntity<List<Pessoa>> findMany(@PathVariable Long[] ids) {
		List<Pessoa> list = new ArrayList<Pessoa>();
		
		for(Long id: ids) {
			Pessoa pessoa = service.findById(id);
			list.add(pessoa);
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
