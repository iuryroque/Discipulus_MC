package com.os.unirios.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

import com.os.unirios.entities.AcompanhamentoEstudo;
import com.os.unirios.entities.LicoesConcluidasPessoa;
import com.os.unirios.repositories.AcompanhamentoEstudoRepository;
import com.os.unirios.services.exceptions.DataIntegrityException;
import com.os.unirios.services.exceptions.ObjectNotFoundException;

        
@Service
public class AcompanhamentoEstudoService {

    @Autowired
    private AcompanhamentoEstudoRepository repo;

   
                        @Autowired 
                        private LicoesConcluidasPessoaService licoesConcluidasPessoaService;
                      

   private final GenericSpecificationUtil<AcompanhamentoEstudo> specUtil = new GenericSpecificationUtil<>();

            
    public List<AcompanhamentoEstudo> findAll(){
        return repo.findAll();
    }

    public Page<AcompanhamentoEstudo> findPage(Integer page, Integer linesPerPage, String orderBy, String direction) {

		PageRequest pageRequest = PageRequest.of(page, linesPerPage, Direction.valueOf(direction), orderBy);
		
		return repo.acompanhamentoEstudoPage(pageRequest);
	
    }

    public Page<AcompanhamentoEstudo> findPageWithFilters(Integer page, Integer linesPerPage, String orderBy, String direction, String filter) {
        
  
        return specUtil.findWithFilters(page, linesPerPage, orderBy, direction, filter, repo);
    }

    public AcompanhamentoEstudo findById(Long id){
        Optional<AcompanhamentoEstudo> obj = repo.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException(
				"Objeto não encontrado! Id: " + id + ", Tipo: " + AcompanhamentoEstudo.class.getName()));
    }

    public AcompanhamentoEstudo insert(AcompanhamentoEstudo obj){
        
                                LicoesConcluidasPessoa licoesConcluidasPessoa = licoesConcluidasPessoaService.findById(obj.getLicoesConcluidasPessoa().getId());
                                obj.setLicoesConcluidasPessoa(licoesConcluidasPessoa);
        
        obj.setId(null);
        obj = repo.save(obj); // salvar e obter objeto monitorado
        return obj;
    }
        
    public AcompanhamentoEstudo delete(Long id) {
        AcompanhamentoEstudo obj = findById(id);//ou existe, ou irá gerar exception
         try {
			repo.deleteById(id);
		} catch (DataIntegrityViolationException e) {
			throw new DataIntegrityException(
					"Não é possível excluir este registro de AcompanhamentoEstudo pois possui vinculos com outros registros");
		}
        return obj;
    }
        
    public AcompanhamentoEstudo update(AcompanhamentoEstudo obj) {
        
                                LicoesConcluidasPessoa licoesConcluidasPessoa = licoesConcluidasPessoaService.findById(obj.getLicoesConcluidasPessoa().getId());
                                obj.setLicoesConcluidasPessoa(licoesConcluidasPessoa);

        AcompanhamentoEstudo newObj = findById(obj.getId());
        
        

        updateData(newObj, obj);
        
        return repo.save(newObj);          
    }

    private void updateData(AcompanhamentoEstudo newObj, AcompanhamentoEstudo obj) {
        
                        newObj.setLicoesConcluidasPessoa(obj.getLicoesConcluidasPessoa());
        newObj.setId(obj.getId());
            newObj.setStatus(obj.getStatus());
            newObj.setDataInicio(obj.getDataInicio());
            newObj.setDataConclusao(obj.getDataConclusao());
            newObj.setCriadoEm(obj.getCriadoEm());
            newObj.setAlteradoEm(obj.getAlteradoEm());
            
    }
}
