package com.os.unirios.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.os.unirios.entities.Culto;
import com.os.unirios.entities.CultoRecorrente;
import com.os.unirios.services.CultoAutoGeneratorService;
import com.os.unirios.services.CultoRecorrenteService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping(value = "/culto-recorrente")
public class CultoRecorrenteController {

    @Autowired
    private CultoRecorrenteService service;

    @Autowired
    private CultoAutoGeneratorService autoGeneratorService;

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<CultoRecorrente>> findAll() {
        List<CultoRecorrente> list = service.findAll();
        return ResponseEntity.ok().body(list);
    }

    @GetMapping(value = "/ativos")
    public ResponseEntity<List<CultoRecorrente>> findAllAtivos() {
        List<CultoRecorrente> list = service.findAllAtivos();
        return ResponseEntity.ok().body(list);
    }

    @GetMapping(value = "/ativos-vigentes")
    public ResponseEntity<List<CultoRecorrente>> findAllAtivosVigentes() {
        List<CultoRecorrente> list = service.findAllAtivosVigentes();
        return ResponseEntity.ok().body(list);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<CultoRecorrente> findById(@PathVariable long id) {
        CultoRecorrente obj = service.findById(id);
        return ResponseEntity.ok().body(obj);
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<CultoRecorrente> insert(@RequestBody CultoRecorrente obj) {
        obj = service.insert(obj);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(obj.getId()).toUri();
        return ResponseEntity.created(uri).body(obj);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<CultoRecorrente> update(@RequestBody CultoRecorrente obj, @PathVariable Long id) {
        obj.setId(id);
        obj = service.update(obj);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(obj.getId()).toUri();
        return ResponseEntity.created(uri).body(obj);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Gera cultos baseados em uma configuração recorrente
     */
    @RequestMapping(value = "/{id}/gerar-cultos", method = RequestMethod.POST)
    public ResponseEntity<List<Culto>> gerarCultosRecorrentes(@PathVariable Long id) {
        List<Culto> cultosGerados = autoGeneratorService.gerarCultosParaConfiguracao(id);
        return ResponseEntity.ok().body(cultosGerados);
    }

    /**
     * Gera cultos para o próximo mês baseado em todas as configurações ativas
     */
    @RequestMapping(value = "/gerar-cultos-proximo-mes", method = RequestMethod.POST)
    public ResponseEntity<List<Culto>> gerarCultosProximoMes() {
        List<Culto> cultosGerados = autoGeneratorService.gerarCultosProximoMesManual();
        return ResponseEntity.ok().body(cultosGerados);
    }

    /**
     * Endpoint para verificar status dos jobs agendados
     */
    @GetMapping(value = "/status-jobs")
    public ResponseEntity<String> getStatusJobs() {
        return ResponseEntity.ok().body("Jobs de geração automática ativos:\n" +
                "- Mensal: Todo dia 1º do mês às 02:00\n" +
                "- Semanal: Todo domingo às 06:00\n" +
                "- Diário: Todo dia às 00:05");
    }
} 