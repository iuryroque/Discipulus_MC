package com.os.unirios.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

import com.os.unirios.entities.LicoesConcluidasPessoa;
import com.os.unirios.repositories.LicoesConcluidasPessoaRepository;
import com.os.unirios.services.exceptions.DataIntegrityException;
import com.os.unirios.services.exceptions.ObjectNotFoundException;

        
@Service
public class LicoesConcluidasPessoaService {

    @Autowired
    private LicoesConcluidasPessoaRepository repo;

   

   private final GenericSpecificationUtil<LicoesConcluidasPessoa> specUtil = new GenericSpecificationUtil<>();

            
    public List<LicoesConcluidasPessoa> findAll(){
        return repo.findAll();
    }

    public Page<LicoesConcluidasPessoa> findPage(Integer page, Integer linesPerPage, String orderBy, String direction) {

		PageRequest pageRequest = PageRequest.of(page, linesPerPage, Direction.valueOf(direction), orderBy);
		
		return repo.licoesConcluidasPessoaPage(pageRequest);
	
    }

    public Page<LicoesConcluidasPessoa> findPageWithFilters(Integer page, Integer linesPerPage, String orderBy, String direction, String filter) {
        
  
        return specUtil.findWithFilters(page, linesPerPage, orderBy, direction, filter, repo);
    }

    public LicoesConcluidasPessoa findById(Long id){
        Optional<LicoesConcluidasPessoa> obj = repo.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException(
				"Objeto não encontrado! Id: " + id + ", Tipo: " + LicoesConcluidasPessoa.class.getName()));
    }

    public LicoesConcluidasPessoa insert(LicoesConcluidasPessoa obj){
        
        
        obj.setId(null);
        obj = repo.save(obj); // salvar e obter objeto monitorado
        return obj;
    }
        
    public LicoesConcluidasPessoa delete(Long id) {
        LicoesConcluidasPessoa obj = findById(id);//ou existe, ou irá gerar exception
         try {
			repo.deleteById(id);
		} catch (DataIntegrityViolationException e) {
			throw new DataIntegrityException(
					"Não é possível excluir este registro de LicoesConcluidasPessoa pois possui vinculos com outros registros");
		}
        return obj;
    }
        
    public LicoesConcluidasPessoa update(LicoesConcluidasPessoa obj) {
        

        LicoesConcluidasPessoa newObj = findById(obj.getId());
        
        

        updateData(newObj, obj);
        
        return repo.save(newObj);          
    }

    private void updateData(LicoesConcluidasPessoa newObj, LicoesConcluidasPessoa obj) {
        
        newObj.setId(obj.getId());
            newObj.setDataConclusao(obj.getDataConclusao());
            newObj.setObservacoes(obj.getObservacoes());
            newObj.setCriadoEm(obj.getCriadoEm());
            newObj.setAtualizadoEm(obj.getAtualizadoEm());
            
    }
}
