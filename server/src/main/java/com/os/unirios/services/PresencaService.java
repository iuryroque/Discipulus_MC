package com.os.unirios.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.os.unirios.entities.Culto;
import com.os.unirios.entities.Pessoa;
import com.os.unirios.entities.Presenca;
import com.os.unirios.entities.enums.StatusPresenca;
// 1. Importações dos repositórios
import com.os.unirios.repositories.CultoRepository;
import com.os.unirios.repositories.PessoaRepository;
import com.os.unirios.repositories.PresencaRepository;
import com.os.unirios.services.exceptions.DataIntegrityException;
import com.os.unirios.services.exceptions.ObjectNotFoundException;

@Service
public class PresencaService {

    @Autowired
    private PresencaRepository repo;

    // 2. Garanta que os repositórios corretos estão sendo injetados
    @Autowired
    private PessoaRepository pessoaRepository;

    @Autowired
    private CultoRepository cultoRepository;

    @Autowired
    private FaltaService faltaService;

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

    @Transactional
    public Presenca insert(Presenca obj){
        // 3. Use o pessoaRepository, não o pessoaService
        if (obj.getPessoa() == null || obj.getPessoa().getId() == null) {
            throw new IllegalArgumentException("Pessoa é obrigatória para criar uma presença");
        }
        Pessoa pessoa = pessoaRepository.findById(obj.getPessoa().getId())
            .orElseThrow(() -> new ObjectNotFoundException("Pessoa não encontrada com ID: " + obj.getPessoa().getId()));
        obj.setPessoa(pessoa);

        if (obj.getCulto() == null || obj.getCulto().getId() == null) {
             throw new IllegalArgumentException("Culto é obrigatório para registrar a presença");
        }
        Culto culto = cultoRepository.findById(obj.getCulto().getId())
            .orElseThrow(() -> new ObjectNotFoundException("Culto não encontrado com ID: " + obj.getCulto().getId()));
        obj.setCulto(culto);
        
        if (obj.getPresente() == null) {
            throw new IllegalArgumentException("Status de presença é obrigatório");
        }
        
        obj.setId(null);
        return repo.save(obj);
    }
        
    public Presenca delete(Long id) {
        Presenca obj = findById(id);
        try {
            repo.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new DataIntegrityException(
                    "Não é possível excluir este registro de Presenca pois possui vinculos com outros registros");
        }
        return obj;
    }
        
    @Transactional
    public Presenca update(Presenca obj) {
        Presenca newObj = findById(obj.getId());
        updateData(newObj, obj);
        return repo.save(newObj);          
    }

    private void updateData(Presenca newObj, Presenca obj) {
        if (obj.getPessoa() != null && obj.getPessoa().getId() != null) {
            Pessoa pessoa = pessoaRepository.findById(obj.getPessoa().getId())
                .orElseThrow(() -> new ObjectNotFoundException("Pessoa não encontrada com ID: " + obj.getPessoa().getId()));
            newObj.setPessoa(pessoa);
        }
         if (obj.getCulto() != null && obj.getCulto().getId() != null) {
            Culto culto = cultoRepository.findById(obj.getCulto().getId())
                .orElseThrow(() -> new ObjectNotFoundException("Culto não encontrado com ID: " + obj.getCulto().getId()));
            newObj.setCulto(culto);
        }
        newObj.setPresente(obj.getPresente());
        newObj.setObservacoes(obj.getObservacoes());
    }

    @Transactional
    public void insertBulk(List<Presenca> presencas) {
        List<Long> idsPessoasPresentes  = new ArrayList<>();
       
        // 2. Pega o Culto UMA VEZ, usando o primeiro item da lista.
        // Isso evita buscar o mesmo culto várias vezes no loop.
        Long cultoId = presencas.get(0).getCulto().getId();
        
        List<Presenca> presencasValidadas = presencas.stream().map(p -> {
            if (p.getPessoa() == null || p.getPessoa().getId() == null) throw new IllegalArgumentException("ID da Pessoa é obrigatório.");
            Pessoa pessoa = pessoaRepository.findById(p.getPessoa().getId())
                .orElseThrow(() -> new ObjectNotFoundException("Pessoa não encontrada com ID: " + p.getPessoa().getId()));
            
            if (p.getCulto() == null || p.getCulto().getId() == null) throw new IllegalArgumentException("ID do Culto é obrigatório.");
            Culto culto = cultoRepository.findById(p.getCulto().getId())
                .orElseThrow(() -> new ObjectNotFoundException("Culto não encontrado com ID: " + p.getCulto().getId()));

            p.setPessoa(pessoa);
            p.setCulto(culto);
            p.setPresente(StatusPresenca.SIM);
            p.setId(null);
            idsPessoasPresentes.add(p.getPessoa().getId());

            return p;
        }).collect(Collectors.toList());

        repo.saveAll(presencasValidadas);
        Culto culto = cultoRepository.findById(cultoId)
        .orElseThrow(() -> new ObjectNotFoundException("Culto não encontrado com ID: " + cultoId));
        // faltaService.computarFaltas(culto, idsPessoasPresentes);
    }
}