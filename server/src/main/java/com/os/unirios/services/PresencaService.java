package com.os.unirios.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

import com.os.unirios.entities.Pessoa;
import com.os.unirios.entities.Presenca;
import com.os.unirios.repositories.PresencaRepository;
import com.os.unirios.services.exceptions.DataIntegrityException;
import com.os.unirios.services.exceptions.ObjectNotFoundException;

        
@Service
public class PresencaService {

    @Autowired
    private PresencaRepository repo;

    @Autowired
    private PessoaService pessoaService;

   

   private final GenericSpecificationUtil<Presenca> specUtil = new GenericSpecificationUtil<>();

            
    public List<Presenca> findAll(){
        return repo.findAll();
    }

    public Page<Presenca> findPage(Integer page, Integer linesPerPage, String orderBy, String direction) {

		PageRequest pageRequest = PageRequest.of(page, linesPerPage, Direction.valueOf(direction), orderBy);
		
		return repo.presencaPage(pageRequest);
	
    }

    public Page<Presenca> findPageWithFilters(Integer page, Integer linesPerPage, String orderBy, String direction, String filter) {
        
  
        return specUtil.findWithFilters(page, linesPerPage, orderBy, direction, filter, repo);
    }

    public Presenca findById(Long id){
        Optional<Presenca> obj = repo.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException(
				"Objeto não encontrado! Id: " + id + ", Tipo: " + Presenca.class.getName()));
    }

    public Presenca insert(Presenca obj){
        
        // Buscar a pessoa se ela foi fornecida
        if (obj.getPessoa() != null && obj.getPessoa().getId() != null) {
            try {
                Pessoa pessoa = pessoaService.findById(obj.getPessoa().getId());
                obj.setPessoa(pessoa);
            } catch (Exception e) {
                throw new ObjectNotFoundException("Pessoa não encontrada com ID: " + obj.getPessoa().getId());
            }
        } else {
            throw new IllegalArgumentException("Pessoa é obrigatória para criar uma presença");
        }
        
        // Validar e normalizar o campo presente
        if (obj.getPresente() == null || obj.getPresente().trim().isEmpty()) {
            throw new IllegalArgumentException("Status de presença é obrigatório");
        }
        
        // Normalizar o valor do campo presente
        String presente = obj.getPresente().trim().toUpperCase();
        if (!presente.equals("SIM") && !presente.equals("NAO") && !presente.equals("JUSTIFICADO")) {
            throw new IllegalArgumentException("Status de presença deve ser SIM, NAO ou JUSTIFICADO");
        }
        obj.setPresente(presente);
        
        // Limpar observações se estiver vazio
        if (obj.getObservacoes() != null && obj.getObservacoes().trim().isEmpty()) {
            obj.setObservacoes(null);
        }
        
        obj.setId(null);
        obj = repo.save(obj); // salvar e obter objeto monitorado
        return obj;
    }
        
    public Presenca delete(Long id) {
        Presenca obj = findById(id);//ou existe, ou irá gerar exception
         try {
			repo.deleteById(id);
		} catch (DataIntegrityViolationException e) {
			throw new DataIntegrityException(
					"Não é possível excluir este registro de Presenca pois possui vinculos com outros registros");
		}
        return obj;
    }
        
    public Presenca update(Presenca obj) {
        
        // Buscar a pessoa se ela foi fornecida
        if (obj.getPessoa() != null && obj.getPessoa().getId() != null) {
            try {
                Pessoa pessoa = pessoaService.findById(obj.getPessoa().getId());
                obj.setPessoa(pessoa);
            } catch (Exception e) {
                throw new ObjectNotFoundException("Pessoa não encontrada com ID: " + obj.getPessoa().getId());
            }
        } else {
            throw new IllegalArgumentException("Pessoa é obrigatória para atualizar uma presença");
        }
        
        // Validar e normalizar o campo presente
        if (obj.getPresente() == null || obj.getPresente().trim().isEmpty()) {
            throw new IllegalArgumentException("Status de presença é obrigatório");
        }
        
        // Normalizar o valor do campo presente
        String presente = obj.getPresente().trim().toUpperCase();
        if (!presente.equals("SIM") && !presente.equals("NAO") && !presente.equals("JUSTIFICADO")) {
            throw new IllegalArgumentException("Status de presença deve ser SIM, NAO ou JUSTIFICADO");
        }
        obj.setPresente(presente);
        
        // Limpar observações se estiver vazio
        if (obj.getObservacoes() != null && obj.getObservacoes().trim().isEmpty()) {
            obj.setObservacoes(null);
        }

        Presenca newObj = findById(obj.getId());
        
        

        updateData(newObj, obj);
        
        return repo.save(newObj);          
    }

    private void updateData(Presenca newObj, Presenca obj) {
        
        newObj.setId(obj.getId());
        newObj.setPresente(obj.getPresente());
        newObj.setObservacoes(obj.getObservacoes());
        newObj.setPessoa(obj.getPessoa());
            
    }
}
