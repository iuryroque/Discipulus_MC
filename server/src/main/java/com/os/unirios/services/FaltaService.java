// src/main/java/com/os/unirios/services/FaltaService.java

package com.os.unirios.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.os.unirios.entities.Culto;
import com.os.unirios.entities.Falta;
import com.os.unirios.entities.Pessoa;
import com.os.unirios.entities.enums.StatusPessoa;
import com.os.unirios.repositories.FaltaRepository;
import com.os.unirios.repositories.PessoaRepository;

@Service
public class FaltaService {

    @Autowired
    private PessoaRepository pessoaRepository;

    @Autowired
    private FaltaRepository faltaRepository;

    /**
     * Este método será executado de forma assíncrona para não bloquear a resposta ao usuário.
     * @param culto O culto para o qual as faltas serão computadas.
     * @param idsPessoasPresentes A lista de IDs das pessoas que estavam presentes.
     */
    @Async
    public void computarFaltas(Culto culto, List<Long> idsPessoasPresentes) {
        // 1. Busca todos os membros ativos
        List<Pessoa> todosOsMembrosAtivos = pessoaRepository.findByStatus(StatusPessoa.ATIVO);

        // 2. Filtra a lista para encontrar os ausentes
        List<Pessoa> ausentes = todosOsMembrosAtivos.stream()
                .filter(membro -> !idsPessoasPresentes.contains(membro.getId()))
                .collect(Collectors.toList());

        // 3. Cria e salva um registro de falta para cada membro ausente
        for (Pessoa ausente : ausentes) {
            Falta falta = new Falta(ausente, culto, culto.getDataHora());
            faltaRepository.save(falta);
        }

        System.out.println("Processo de faltas concluído. " + ausentes.size() + " faltas registradas para o culto ID: " + culto.getId());
    }
}