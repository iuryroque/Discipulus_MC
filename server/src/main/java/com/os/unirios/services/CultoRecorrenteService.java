package com.os.unirios.services;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.os.unirios.entities.Culto;
import com.os.unirios.entities.CultoRecorrente;
import com.os.unirios.entities.enums.DiaSemana;
import com.os.unirios.repositories.CultoRecorrenteRepository;
import com.os.unirios.repositories.CultoRepository;
import com.os.unirios.services.exceptions.ObjectNotFoundException;

@Service
public class CultoRecorrenteService {

    @Autowired
    private CultoRecorrenteRepository repository;

    @Autowired
    private CultoRepository cultoRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public List<CultoRecorrente> findAll() {
        return repository.findAll();
    }

    public List<CultoRecorrente> findAllAtivos() {
        return repository.findAllAtivos();
    }

    public List<CultoRecorrente> findAllAtivosVigentes() {
        return repository.findAllAtivosVigentes();
    }

    public CultoRecorrente findById(Long id) {
        Optional<CultoRecorrente> obj = repository.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Culto Recorrente não encontrado! Id: " + id));
    }

    public CultoRecorrente insert(CultoRecorrente obj) {
        obj.setId(null);
        obj.setAtivo(true);
        return repository.save(obj);
    }

    public CultoRecorrente update(CultoRecorrente obj) {
        CultoRecorrente entity = findById(obj.getId());
        
        // Copiar campos do objeto recebido para a entidade persistente
        entity.setTitulo(obj.getTitulo());
        entity.setHora(obj.getHora());
        entity.setLocal(obj.getLocal());
        entity.setDescricao(obj.getDescricao());
        entity.setPregador(obj.getPregador());
        entity.setStatus(obj.getStatus());
        entity.setObservacoes(obj.getObservacoes());
        entity.setDiaSemana(obj.getDiaSemana());
        entity.setDataInicio(obj.getDataInicio());
        entity.setDataFim(obj.getDataFim());
        entity.setAtivo(obj.getAtivo());
        
        return repository.save(entity);
    }

    public void delete(Long id) {
        CultoRecorrente cultoRecorrente = findById(id);
        cultoRecorrente.setAtivo(false);
        repository.save(cultoRecorrente);
    }

    /**
     * Gera cultos baseados em uma configuração recorrente
     */
    public List<Culto> gerarCultosRecorrentes(Long cultoRecorrenteId) {
        CultoRecorrente cultoRecorrente = findById(cultoRecorrenteId);
        return gerarCultosRecorrentes(cultoRecorrente);
    }

    /**
     * Gera cultos baseados em uma configuração recorrente
     */
    public List<Culto> gerarCultosRecorrentes(CultoRecorrente cultoRecorrente) {
        List<Culto> cultosGerados = new ArrayList<>();
        
        try {
            // Agora usamos um único dia da semana
            DiaSemana diaSemana = cultoRecorrente.getDiaSemana();
            int diaSemanaInt = diaSemana.getValor();
            
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(cultoRecorrente.getDataInicio());
            
            // Ajusta para o primeiro dia da semana configurado
            // Calendar.DAY_OF_WEEK: 1=Domingo, 2=Segunda, ..., 7=Sábado
            while (calendar.get(Calendar.DAY_OF_WEEK) != diaSemanaInt) {
                calendar.add(Calendar.DAY_OF_MONTH, 1);
            }
            
            // Parse da hora com tratamento robusto
            int hora = 0;
            int minuto = 0;
            
            try {
                String horaStr = cultoRecorrente.getHora();
                if (horaStr != null && !horaStr.trim().isEmpty()) {
                    // Remove caracteres especiais e espaços
                    horaStr = horaStr.trim().replaceAll("[^0-9:]", "");
                    
                    if (horaStr.contains(":")) {
                        String[] horaMinuto = horaStr.split(":");
                        if (horaMinuto.length >= 2) {
                            hora = Integer.parseInt(horaMinuto[0]);
                            minuto = Integer.parseInt(horaMinuto[1]);
                        }
                    } else if (horaStr.length() >= 4) {
                        // Formato HHMM
                        hora = Integer.parseInt(horaStr.substring(0, 2));
                        minuto = Integer.parseInt(horaStr.substring(2, 4));
                    } else if (horaStr.length() >= 2) {
                        // Apenas hora
                        hora = Integer.parseInt(horaStr);
                    }
                }
                
                // Validação dos valores
                if (hora < 0 || hora > 23) {
                    hora = 19; // Hora padrão se inválida
                }
                if (minuto < 0 || minuto > 59) {
                    minuto = 0; // Minuto padrão se inválido
                }
                
            } catch (Exception e) {
                // Se não conseguir fazer o parse, usa valores padrão
                hora = 19;
                minuto = 0;
            }
            
            // Define o período de geração
            Calendar dataFim = Calendar.getInstance();
            if (cultoRecorrente.getDataFim() != null) {
                dataFim.setTime(cultoRecorrente.getDataFim());
            } else {
                // Se não há data de fim, gera cultos para os próximos 3 meses (período mais razoável)
                dataFim.add(Calendar.MONTH, 3);
            }
            
            while (calendar.getTime().before(dataFim.getTime()) || 
                   calendar.getTime().equals(dataFim.getTime())) {
                
                // Verifica se o dia atual é o dia da semana configurado
                if (calendar.get(Calendar.DAY_OF_WEEK) == diaSemanaInt) {
                    
                    // Cria a data e hora do culto
                    Calendar dataHoraCulto = Calendar.getInstance();
                    dataHoraCulto.setTime(calendar.getTime());
                    dataHoraCulto.set(Calendar.HOUR_OF_DAY, hora);
                    dataHoraCulto.set(Calendar.MINUTE, minuto);
                    dataHoraCulto.set(Calendar.SECOND, 0);
                    dataHoraCulto.set(Calendar.MILLISECOND, 0);
                    
                    // Verifica se já existe um culto para esta data e hora
                    if (!existeCultoParaDataHora(dataHoraCulto.getTime(), cultoRecorrente.getLocal(), cultoRecorrente.getTitulo())) {
                        
                        // Cria o culto
                        Culto culto = new Culto();
                        culto.setTitulo(cultoRecorrente.getTitulo());
                        culto.setNome(cultoRecorrente.getTitulo()); // Usa o título como nome
                        culto.setTipo("RECORRENTE"); // Tipo padrão para cultos gerados
                        culto.setDataHora(dataHoraCulto.getTime());
                        culto.setLocal(cultoRecorrente.getLocal());
                        culto.setDescricao(cultoRecorrente.getDescricao());
                        culto.setPregador(cultoRecorrente.getPregador());
                        culto.setStatus(cultoRecorrente.getStatus());
                        culto.setObservacoes(cultoRecorrente.getObservacoes());
                        
                        culto = cultoRepository.save(culto);
                        cultosGerados.add(culto);
                    }
                }
                
                calendar.add(Calendar.DAY_OF_MONTH, 1);
            }
            
        } catch (Exception e) {
            throw new RuntimeException("Erro ao processar dia da semana: " + e.getMessage());
        }
        
        return cultosGerados;
    }

    /**
     * Gera cultos para o próximo mês baseado em todas as configurações ativas
     */
    public List<Culto> gerarCultosProximoMes() {
        List<Culto> todosCultosGerados = new ArrayList<>();
        List<CultoRecorrente> cultosRecorrentes = findAllAtivosVigentes();
        
        // Calcula o período do próximo mês
        Calendar hoje = Calendar.getInstance();
        Calendar inicioProximoMes = Calendar.getInstance();
        inicioProximoMes.add(Calendar.MONTH, 1);
        inicioProximoMes.set(Calendar.DAY_OF_MONTH, 1);
        inicioProximoMes.set(Calendar.HOUR_OF_DAY, 0);
        inicioProximoMes.set(Calendar.MINUTE, 0);
        inicioProximoMes.set(Calendar.SECOND, 0);
        inicioProximoMes.set(Calendar.MILLISECOND, 0);
        
        Calendar fimProximoMes = Calendar.getInstance();
        fimProximoMes.setTime(inicioProximoMes.getTime());
        fimProximoMes.add(Calendar.MONTH, 1);
        fimProximoMes.add(Calendar.DAY_OF_MONTH, -1);
        fimProximoMes.set(Calendar.HOUR_OF_DAY, 23);
        fimProximoMes.set(Calendar.MINUTE, 59);
        fimProximoMes.set(Calendar.SECOND, 59);
        
        for (CultoRecorrente cultoRecorrente : cultosRecorrentes) {
            // Verifica se já existem cultos para esta configuração no período
            if (!existemCultosParaConfiguracaoNoPeriodo(
                cultoRecorrente.getTitulo(), 
                inicioProximoMes.getTime(), 
                fimProximoMes.getTime()
            )) {
                List<Culto> cultosGerados = gerarCultosParaPeriodo(
                    cultoRecorrente, 
                    inicioProximoMes.getTime(), 
                    fimProximoMes.getTime()
                );
                todosCultosGerados.addAll(cultosGerados);
            }
        }
        
        return todosCultosGerados;
    }

    /**
     * Gera cultos para um período específico
     */
    public List<Culto> gerarCultosParaPeriodo(CultoRecorrente cultoRecorrente, Date dataInicio, Date dataFim) {
        List<Culto> cultosGerados = new ArrayList<>();
        
        try {
            DiaSemana diaSemana = cultoRecorrente.getDiaSemana();
            int diaSemanaInt = diaSemana.getValor();
            
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(dataInicio);
            
            // Ajusta para o primeiro dia da semana configurado dentro do período
            while (calendar.getTime().before(dataFim) && calendar.get(Calendar.DAY_OF_WEEK) != diaSemanaInt) {
                calendar.add(Calendar.DAY_OF_MONTH, 1);
            }
            
            // Parse da hora com tratamento robusto
            int hora = 0;
            int minuto = 0;
            
            try {
                String horaStr = cultoRecorrente.getHora();
                if (horaStr != null && !horaStr.trim().isEmpty()) {
                    // Remove caracteres especiais e espaços
                    horaStr = horaStr.trim().replaceAll("[^0-9:]", "");
                    
                    if (horaStr.contains(":")) {
                        String[] horaMinuto = horaStr.split(":");
                        if (horaMinuto.length >= 2) {
                            hora = Integer.parseInt(horaMinuto[0]);
                            minuto = Integer.parseInt(horaMinuto[1]);
                        }
                    } else if (horaStr.length() >= 4) {
                        // Formato HHMM
                        hora = Integer.parseInt(horaStr.substring(0, 2));
                        minuto = Integer.parseInt(horaStr.substring(2, 4));
                    } else if (horaStr.length() >= 2) {
                        // Apenas hora
                        hora = Integer.parseInt(horaStr);
                    }
                }
                
                // Validação dos valores
                if (hora < 0 || hora > 23) {
                    hora = 19; // Hora padrão se inválida
                }
                if (minuto < 0 || minuto > 59) {
                    minuto = 0; // Minuto padrão se inválido
                }
                
            } catch (Exception e) {
                // Se não conseguir fazer o parse, usa valores padrão
                hora = 19;
                minuto = 0;
            }
            
            while (calendar.getTime().before(dataFim) || calendar.getTime().equals(dataFim)) {
                
                // Verifica se o dia atual é o dia da semana configurado
                if (calendar.get(Calendar.DAY_OF_WEEK) == diaSemanaInt) {
                    
                    // Cria a data e hora do culto
                    Calendar dataHoraCulto = Calendar.getInstance();
                    dataHoraCulto.setTime(calendar.getTime());
                    dataHoraCulto.set(Calendar.HOUR_OF_DAY, hora);
                    dataHoraCulto.set(Calendar.MINUTE, minuto);
                    dataHoraCulto.set(Calendar.SECOND, 0);
                    dataHoraCulto.set(Calendar.MILLISECOND, 0);
                    
                    // Verifica se já existe um culto para esta data e hora
                    if (!existeCultoParaDataHora(dataHoraCulto.getTime(), cultoRecorrente.getLocal(), cultoRecorrente.getTitulo())) {
                        
                        // Cria o culto
                        Culto culto = new Culto();
                        culto.setTitulo(cultoRecorrente.getTitulo());
                        culto.setNome(cultoRecorrente.getTitulo()); // Usa o título como nome
                        culto.setTipo("RECORRENTE"); // Tipo padrão para cultos gerados
                        culto.setDataHora(dataHoraCulto.getTime());
                        culto.setLocal(cultoRecorrente.getLocal());
                        culto.setDescricao(cultoRecorrente.getDescricao());
                        culto.setPregador(cultoRecorrente.getPregador());
                        culto.setStatus(cultoRecorrente.getStatus());
                        culto.setObservacoes(cultoRecorrente.getObservacoes());
                        
                        culto = cultoRepository.save(culto);
                        cultosGerados.add(culto);
                    }
                }
                
                calendar.add(Calendar.DAY_OF_MONTH, 1);
            }
            
        } catch (Exception e) {
            throw new RuntimeException("Erro ao processar dia da semana: " + e.getMessage());
        }
        
        return cultosGerados;
    }

    /**
     * Verifica se já existe um culto para a data e hora especificadas
     */
    private boolean existeCultoParaDataHora(Date dataHora, String local, String titulo) {
        try {
            // Cria um intervalo de 30 minutos antes e depois
            Calendar inicio = Calendar.getInstance();
            inicio.setTime(dataHora);
            inicio.add(Calendar.MINUTE, -30);
            
            Calendar fim = Calendar.getInstance();
            fim.setTime(dataHora);
            fim.add(Calendar.MINUTE, 30);
            
            // Busca cultos no mesmo local dentro do intervalo de tempo
            List<Culto> cultosExistentes = cultoRepository.findByLocalAndDataHoraProxima(
                local, 
                inicio.getTime(), 
                fim.getTime()
            );
            
            // Verifica se algum culto é duplicado
            for (Culto culto : cultosExistentes) {
                // Se é um culto recorrente, considera como duplicado
                if ("RECORRENTE".equals(culto.getTipo())) {
                    return true;
                }
                
                // Se tem o mesmo título, também considera como duplicado
                if (titulo != null && titulo.equals(culto.getTitulo())) {
                    return true;
                }
            }
            
            return false;
            
        } catch (Exception e) {
            // Se houver erro na verificação, assume que não existe para não bloquear a criação
            return false;
        }
    }

    /**
     * Verifica se já existem cultos para uma configuração no período especificado
     */
    public boolean existemCultosParaConfiguracaoNoPeriodo(String titulo, Date dataInicio, Date dataFim) {
        try {
            List<Culto> cultosExistentes = cultoRepository.findByTituloAndDataHoraBetween(titulo, dataInicio, dataFim);
            return !cultosExistentes.isEmpty();
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Verifica se já existem cultos recorrentes no período especificado
     */
    public boolean existemCultosRecorrentesNoPeriodo(Date dataInicio, Date dataFim) {
        try {
            List<Culto> cultosExistentes = cultoRepository.findByTipoAndDataHoraBetween("RECORRENTE", dataInicio, dataFim);
            return !cultosExistentes.isEmpty();
        } catch (Exception e) {
            return false;
        }
    }

} 