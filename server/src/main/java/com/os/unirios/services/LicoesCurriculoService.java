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
import com.os.unirios.entities.LicoesCurriculo;
import com.os.unirios.repositories.LicoesCurriculoRepository;
import com.os.unirios.services.exceptions.DataIntegrityException;
import com.os.unirios.services.exceptions.ObjectNotFoundException;

        
@Service
public class LicoesCurriculoService {

    @Autowired
    private LicoesCurriculoRepository repo;

   
                        @Autowired 
                        private LicoesConcluidasPessoaService licoesConcluidasPessoaService;
                      

   private final GenericSpecificationUtil<LicoesCurriculo> specUtil = new GenericSpecificationUtil<>();

            
    public List<LicoesCurriculo> findAll(){
        return repo.findAll();
    }

    public Page<LicoesCurriculo> findPage(Integer page, Integer linesPerPage, String orderBy, String direction) {

		PageRequest pageRequest = PageRequest.of(page, linesPerPage, Direction.valueOf(direction), orderBy);
		
		return repo.licoesCurriculoPage(pageRequest);
	
    }

    public Page<LicoesCurriculo> findPageWithFilters(Integer page, Integer linesPerPage, String orderBy, String direction, String filter) {
        
  
        return specUtil.findWithFilters(page, linesPerPage, orderBy, direction, filter, repo);
    }

    public LicoesCurriculo findById(Long id){
        Optional<LicoesCurriculo> obj = repo.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException(
				"Objeto não encontrado! Id: " + id + ", Tipo: " + LicoesCurriculo.class.getName()));
    }

    public LicoesCurriculo insert(LicoesCurriculo obj){
        
                                LicoesConcluidasPessoa licoesConcluidasPessoa = licoesConcluidasPessoaService.findById(obj.getLicoesConcluidasPessoa().getId());
                                obj.setLicoesConcluidasPessoa(licoesConcluidasPessoa);
        
        obj.setId(null);
        obj = repo.save(obj); // salvar e obter objeto monitorado
        return obj;
    }
        
    public LicoesCurriculo delete(Long id) {
        LicoesCurriculo obj = findById(id);//ou existe, ou irá gerar exception
         try {
			repo.deleteById(id);
		} catch (DataIntegrityViolationException e) {
			throw new DataIntegrityException(
					"Não é possível excluir este registro de LicoesCurriculo pois possui vinculos com outros registros");
		}
        return obj;
    }
        
    public LicoesCurriculo update(LicoesCurriculo obj) {
        
                                LicoesConcluidasPessoa licoesConcluidasPessoa = licoesConcluidasPessoaService.findById(obj.getLicoesConcluidasPessoa().getId());
                                obj.setLicoesConcluidasPessoa(licoesConcluidasPessoa);

        LicoesCurriculo newObj = findById(obj.getId());
        
        

        updateData(newObj, obj);
        
        return repo.save(newObj);          
    }

    private void updateData(LicoesCurriculo newObj, LicoesCurriculo obj) {
        
                        newObj.setLicoesConcluidasPessoa(obj.getLicoesConcluidasPessoa());
        newObj.setId(obj.getId());
            newObj.setNumeroLicao(obj.getNumeroLicao());
            newObj.setTitulo(obj.getTitulo());
            newObj.setConteudo(obj.getConteudo());
            newObj.setCriadoEm(obj.getCriadoEm());
            newObj.setAlteradoEm(obj.getAlteradoEm());
            
    }
}
