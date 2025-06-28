package com.os.unirios.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

import com.os.unirios.entities.Alertas;
import com.os.unirios.repositories.AlertasRepository;
import com.os.unirios.services.exceptions.DataIntegrityException;
import com.os.unirios.services.exceptions.ObjectNotFoundException;

        
@Service
public class AlertasService {

    @Autowired
    private AlertasRepository repo;

   

   private final GenericSpecificationUtil<Alertas> specUtil = new GenericSpecificationUtil<>();

            
    public List<Alertas> findAll(){
        return repo.findAll();
    }

    public Page<Alertas> findPage(Integer page, Integer linesPerPage, String orderBy, String direction) {

		PageRequest pageRequest = PageRequest.of(page, linesPerPage, Direction.valueOf(direction), orderBy);
		
		return repo.alertasPage(pageRequest);
	
    }

    public Page<Alertas> findPageWithFilters(Integer page, Integer linesPerPage, String orderBy, String direction, String filter) {
        
  
        return specUtil.findWithFilters(page, linesPerPage, orderBy, direction, filter, repo);
    }

    public Alertas findById(Long id){
        Optional<Alertas> obj = repo.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException(
				"Objeto não encontrado! Id: " + id + ", Tipo: " + Alertas.class.getName()));
    }

    public Alertas insert(Alertas obj){
        
        
        obj.setId(null);
        obj = repo.save(obj); // salvar e obter objeto monitorado
        return obj;
    }
        
    public Alertas delete(Long id) {
        Alertas obj = findById(id);//ou existe, ou irá gerar exception
         try {
			repo.deleteById(id);
		} catch (DataIntegrityViolationException e) {
			throw new DataIntegrityException(
					"Não é possível excluir este registro de Alertas pois possui vinculos com outros registros");
		}
        return obj;
    }
        
    public Alertas update(Alertas obj) {
        

        Alertas newObj = findById(obj.getId());
        
        

        updateData(newObj, obj);
        
        return repo.save(newObj);          
    }

    private void updateData(Alertas newObj, Alertas obj) {
        
        newObj.setId(obj.getId());
            newObj.setTipo(obj.getTipo());
            newObj.setTitulo(obj.getTitulo());
            newObj.setMensagem(obj.getMensagem());
            newObj.setResolvido(obj.getResolvido());
            newObj.setDataAlerta(obj.getDataAlerta());
            newObj.setDataResolucao(obj.getDataResolucao());
            newObj.setCriadoEm(obj.getCriadoEm());
            newObj.setAlteradoEm(obj.getAlteradoEm());
            
    }
}
