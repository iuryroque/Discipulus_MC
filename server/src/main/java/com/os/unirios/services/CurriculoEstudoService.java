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
import com.os.unirios.entities.CurriculoEstudo;
import com.os.unirios.repositories.CurriculoEstudoRepository;
import com.os.unirios.services.exceptions.DataIntegrityException;
import com.os.unirios.services.exceptions.ObjectNotFoundException;

        
@Service
public class CurriculoEstudoService {

    @Autowired
    private CurriculoEstudoRepository repo;

   
                        @Autowired 
                        private AcompanhamentoEstudoService acompanhamentoEstudoService;
                      

                        @Autowired 
                        private LicoesCurriculoService licoesCurriculoService;
                      

   private final GenericSpecificationUtil<CurriculoEstudo> specUtil = new GenericSpecificationUtil<>();

            
    public List<CurriculoEstudo> findAll(){
        return repo.findAll();
    }

    public Page<CurriculoEstudo> findPage(Integer page, Integer linesPerPage, String orderBy, String direction) {

		PageRequest pageRequest = PageRequest.of(page, linesPerPage, Direction.valueOf(direction), orderBy);
		
		return repo.curriculoEstudoPage(pageRequest);
	
    }

    public Page<CurriculoEstudo> findPageWithFilters(Integer page, Integer linesPerPage, String orderBy, String direction, String filter) {
        
  
        return specUtil.findWithFilters(page, linesPerPage, orderBy, direction, filter, repo);
    }

    public CurriculoEstudo findById(Long id){
        Optional<CurriculoEstudo> obj = repo.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException(
				"Objeto não encontrado! Id: " + id + ", Tipo: " + CurriculoEstudo.class.getName()));
    }

    public CurriculoEstudo insert(CurriculoEstudo obj){
        
                                AcompanhamentoEstudo acompanhamentoEstudo = acompanhamentoEstudoService.findById(obj.getAcompanhamentoEstudo().getId());
                            obj.setAcompanhamentoEstudo(acompanhamentoEstudo);

        
        obj.setId(null);
        obj = repo.save(obj); // salvar e obter objeto monitorado
        return obj;
    }
        
    public CurriculoEstudo delete(Long id) {
        CurriculoEstudo obj = findById(id);//ou existe, ou irá gerar exception
         try {
			repo.deleteById(id);
		} catch (DataIntegrityViolationException e) {
			throw new DataIntegrityException(
					"Não é possível excluir este registro de CurriculoEstudo pois possui vinculos com outros registros");
		}
        return obj;
    }
        
    public CurriculoEstudo update(CurriculoEstudo obj) {
        
                                AcompanhamentoEstudo acompanhamentoEstudo = acompanhamentoEstudoService.findById(obj.getAcompanhamentoEstudo().getId());
                            obj.setAcompanhamentoEstudo(acompanhamentoEstudo);

        CurriculoEstudo newObj = findById(obj.getId());
        
        

        updateData(newObj, obj);
        
        return repo.save(newObj);          
    }

    private void updateData(CurriculoEstudo newObj, CurriculoEstudo obj) {
        
                        newObj.setAcompanhamentoEstudo(obj.getAcompanhamentoEstudo());

        newObj.setId(obj.getId());
            newObj.setNome(obj.getNome());
            newObj.setDescricao(obj.getDescricao());
            newObj.setCriadoEm(obj.getCriadoEm());
            newObj.setAlteradoEm(obj.getAlteradoEm());
            
    }
}
