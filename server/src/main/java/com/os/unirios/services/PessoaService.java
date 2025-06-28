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
import com.os.unirios.entities.Alertas;
import com.os.unirios.entities.Pessoa;
import com.os.unirios.entities.Presenca;
import com.os.unirios.repositories.PessoaRepository;
import com.os.unirios.repositories.PresencaRepository;
import com.os.unirios.services.exceptions.DataIntegrityException;
import com.os.unirios.services.exceptions.ObjectNotFoundException;

        
@Service
public class PessoaService {

    @Autowired
    private PessoaRepository repo;

    @Autowired
    private PresencaRepository presencaRepository;

   
                        @Autowired 
                        private AcompanhamentoEstudoService acompanhamentoEstudoService;
                      

                        @Autowired 
                        private AlertasService alertasService;
                      

   private final GenericSpecificationUtil<Pessoa> specUtil = new GenericSpecificationUtil<>();

            
    public List<Pessoa> findAll(){
        return repo.findAll();
    }

    public Page<Pessoa> findPage(Integer page, Integer linesPerPage, String orderBy, String direction) {

		PageRequest pageRequest = PageRequest.of(page, linesPerPage, Direction.valueOf(direction), orderBy);
		
		return repo.pessoaPage(pageRequest);
	
    }

    public Page<Pessoa> findPageWithFilters(Integer page, Integer linesPerPage, String orderBy, String direction, String filter) {
        
  
        return specUtil.findWithFilters(page, linesPerPage, orderBy, direction, filter, repo);
    }

    public Pessoa findById(Long id){
        Optional<Pessoa> obj = repo.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException(
				"Objeto não encontrado! Id: " + id + ", Tipo: " + Pessoa.class.getName()));
    }

    public Pessoa insert(Pessoa obj){
        
        if (obj.getAcompanhamentoEstudo() != null && obj.getAcompanhamentoEstudo().getId() != null) {
            AcompanhamentoEstudo acompanhamentoEstudo = acompanhamentoEstudoService.findById(obj.getAcompanhamentoEstudo().getId());
            obj.setAcompanhamentoEstudo(acompanhamentoEstudo);
        }

        if (obj.getAlertas() != null && obj.getAlertas().getId() != null) {
            Alertas alertas = alertasService.findById(obj.getAlertas().getId());
            obj.setAlertas(alertas);
        }

        if (obj.getPresenca() != null && obj.getPresenca().getId() != null) {
            Optional<Presenca> presencaOpt = presencaRepository.findById(obj.getPresenca().getId());
            Presenca presenca = presencaOpt.orElseThrow(() -> new ObjectNotFoundException(
                "Presenca não encontrada! Id: " + obj.getPresenca().getId()));
            obj.setPresenca(presenca);
        }
        
        obj.setId(null);
        obj = repo.save(obj); // salvar e obter objeto monitorado
        return obj;
    }
        
    public Pessoa delete(Long id) {
        Pessoa obj = findById(id);//ou existe, ou irá gerar exception
         try {
			repo.deleteById(id);
		} catch (DataIntegrityViolationException e) {
			throw new DataIntegrityException(
					"Não é possível excluir este registro de Pessoa pois possui vinculos com outros registros");
		}
        return obj;
    }
        
    public Pessoa update(Pessoa obj) {
        
        // Criar uma cópia do objeto para evitar problemas de finalidade
        Pessoa objCopy = new Pessoa();
        objCopy.setId(obj.getId());
        objCopy.setNomeCompleto(obj.getNomeCompleto());
        objCopy.setDataNascimento(obj.getDataNascimento());
        objCopy.setTelefone(obj.getTelefone());
        objCopy.setEmail(obj.getEmail());
        objCopy.setEndereco(obj.getEndereco());
        objCopy.setStatus(obj.getStatus());
        objCopy.setTipo(obj.getTipo());
        objCopy.setStatusBatismo(obj.getStatusBatismo());
        objCopy.setDataInteresseBatismo(obj.getDataInteresseBatismo());
        objCopy.setDataBatismo(obj.getDataBatismo());
        objCopy.setObservacoes(obj.getObservacoes());
        objCopy.setAcompanhamentoEstudo(obj.getAcompanhamentoEstudo());
        objCopy.setAlertas(obj.getAlertas());
        objCopy.setPresenca(obj.getPresenca());
        
        if (objCopy.getAcompanhamentoEstudo() != null && objCopy.getAcompanhamentoEstudo().getId() != null) {
            AcompanhamentoEstudo acompanhamentoEstudo = acompanhamentoEstudoService.findById(objCopy.getAcompanhamentoEstudo().getId());
            objCopy.setAcompanhamentoEstudo(acompanhamentoEstudo);
        }

        if (objCopy.getAlertas() != null && objCopy.getAlertas().getId() != null) {
            Alertas alertas = alertasService.findById(objCopy.getAlertas().getId());
            objCopy.setAlertas(alertas);
        }

        if (objCopy.getPresenca() != null && objCopy.getPresenca().getId() != null) {
            Optional<Presenca> presencaOpt = presencaRepository.findById(objCopy.getPresenca().getId());
            if (presencaOpt.isPresent()) {
                objCopy.setPresenca(presencaOpt.get());
            } else {
                throw new ObjectNotFoundException("Presenca não encontrada! Id: " + objCopy.getPresenca().getId());
            }
        }

        Pessoa newObj = findById(objCopy.getId());
        
        

        updateData(newObj, objCopy);
        
        return repo.save(newObj);          
    }

    private void updateData(Pessoa newObj, Pessoa obj) {
        
                        newObj.setAcompanhamentoEstudo(obj.getAcompanhamentoEstudo());

                        newObj.setAlertas(obj.getAlertas());

                        newObj.setPresenca(obj.getPresenca());
        newObj.setId(obj.getId());
            newObj.setNomeCompleto(obj.getNomeCompleto());
            newObj.setDataNascimento(obj.getDataNascimento());
            newObj.setTelefone(obj.getTelefone());
            newObj.setEmail(obj.getEmail());
            newObj.setEndereco(obj.getEndereco());
            newObj.setStatus(obj.getStatus());
            newObj.setTipo(obj.getTipo());
            newObj.setStatusBatismo(obj.getStatusBatismo());
            newObj.setDataInteresseBatismo(obj.getDataInteresseBatismo());
            newObj.setDataBatismo(obj.getDataBatismo());
            newObj.setObservacoes(obj.getObservacoes());
            
    }
}
