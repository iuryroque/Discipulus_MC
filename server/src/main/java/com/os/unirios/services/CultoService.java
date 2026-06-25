package com.os.unirios.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

import com.os.unirios.entities.Culto;
import com.os.unirios.entities.Presenca;
import com.os.unirios.repositories.CultoRepository;
import com.os.unirios.services.exceptions.DataIntegrityException;
import com.os.unirios.services.exceptions.ObjectNotFoundException;

        
@Service
public class CultoService {

    @Autowired
    private CultoRepository repo;

   
    @Autowired 
    private PresencaService presencaService;
                      

    private final GenericSpecificationUtil<Culto> specUtil = new GenericSpecificationUtil<>();

            
    public List<Culto> findAll(){
        return repo.findAll();
    }

    public Page<Culto> findPage(Integer page, Integer linesPerPage, String orderBy, String direction) {

		PageRequest pageRequest = PageRequest.of(page, linesPerPage, Direction.valueOf(direction), orderBy);
		
		return repo.cultoPage(pageRequest);
	
    }

    public Page<Culto> findPageWithFilters(Integer page, Integer linesPerPage, String orderBy, String direction, String filter) {
        
  
        return specUtil.findWithFilters(page, linesPerPage, orderBy, direction, filter, repo);
    }

    public Culto findById(Long id){
        Optional<Culto> obj = repo.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException(
				"Objeto não encontrado! Id: " + id + ", Tipo: " + Culto.class.getName()));
    }

    public Culto insert(Culto obj){
        
        // Verificar se presenca não é null antes de tentar acessar
        if (obj.getPresenca() != null && obj.getPresenca().getId() != null) {
            Presenca presenca = presencaService.findById(obj.getPresenca().getId());
            obj.setPresenca(presenca);
        } else {
            obj.setPresenca(null);
        }
        
        obj.setId(null);
        obj = repo.save(obj); // salvar e obter objeto monitorado
        return obj;
    }
        
    public Culto delete(Long id) {
        Culto obj = findById(id);//ou existe, ou irá gerar exception
         try {
			repo.deleteById(id);
		} catch (DataIntegrityViolationException e) {
			throw new DataIntegrityException(
					"Não é possível excluir este registro de Culto pois possui vinculos com outros registros");
		}
        return obj;
    }
        
    public Culto update(Culto obj) {
        
        // Verificar se presenca não é null antes de tentar acessar
        if (obj.getPresenca() != null && obj.getPresenca().getId() != null) {
            Presenca presenca = presencaService.findById(obj.getPresenca().getId());
            obj.setPresenca(presenca);
        } else {
            obj.setPresenca(null);
        }

        Culto newObj = findById(obj.getId());
        
        updateData(newObj, obj);
        
        return repo.save(newObj);          
    }

    private void updateData(Culto newObj, Culto obj) {
        
        newObj.setPresenca(obj.getPresenca());
        newObj.setId(obj.getId());
        newObj.setTitulo(obj.getTitulo());
        newObj.setNome(obj.getNome());
        newObj.setTipo(obj.getTipo());
        newObj.setDataHora(obj.getDataHora());
        newObj.setLocal(obj.getLocal());
        newObj.setDescricao(obj.getDescricao());
        newObj.setPregador(obj.getPregador());
        newObj.setStatus(obj.getStatus());
        newObj.setObservacoes(obj.getObservacoes());
        newObj.setCriadoEm(obj.getCriadoEm());
        newObj.setAlteradoEm(obj.getAlteradoEm());
            
    }
}
