package com.os.unirios.services;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.os.unirios.entities.Culto;
import com.os.unirios.entities.CultoRecorrente;

/**
 * Serviço para geração automática de cultos via jobs agendados
 */
@Service
public class CultoAutoGeneratorService {

    private static final Logger logger = LoggerFactory.getLogger(CultoAutoGeneratorService.class);

    @Autowired
    private CultoRecorrenteService cultoRecorrenteService;

    /**
     * Job que roda todo dia 1º do mês às 02:00 da manhã
     * Gera cultos para o mês atual baseado nas configurações ativas
     */
    @Scheduled(cron = "0 0 2 1 * ?") // Todo dia 1º do mês às 02:00
    public void gerarCultosMensalmente() {
        logger.info("🕐 Iniciando job de geração mensal de cultos...");
        
        try {
            // Busca configurações ativas e vigentes
            List<CultoRecorrente> configsAtivas = cultoRecorrenteService.findAllAtivosVigentes();
            
            if (configsAtivas.isEmpty()) {
                logger.info("ℹ️ Nenhuma configuração ativa encontrada para geração automática");
                return;
            }

            logger.info("📋 Encontradas {} configurações ativas", configsAtivas.size());

            // Gera cultos para o mês atual
            List<Culto> cultosGerados = cultoRecorrenteService.gerarCultosProximoMes();
            
            logger.info("✅ Job de geração mensal concluído: {} cultos gerados", cultosGerados.size());
            
            // Log detalhado dos cultos gerados
            for (Culto culto : cultosGerados) {
                logger.info("📅 Culto gerado: {} - {} - {}", 
                    culto.getTitulo(), 
                    culto.getDataHora(), 
                    culto.getLocal());
            }
            
        } catch (Exception e) {
            logger.error("❌ Erro no job de geração mensal de cultos: {}", e.getMessage(), e);
        }
    }

    /**
     * Job que roda todo domingo às 06:00 da manhã
     * Verifica se há cultos para a semana atual e gera se necessário
     */
    @Scheduled(cron = "0 0 6 ? * SUN") // Todo domingo às 06:00
    public void verificarCultosSemanais() {
        logger.info("🕐 Iniciando verificação semanal de cultos...");
        
        try {
            // Busca configurações ativas
            List<CultoRecorrente> configsAtivas = cultoRecorrenteService.findAllAtivosVigentes();
            
            if (configsAtivas.isEmpty()) {
                logger.info("ℹ️ Nenhuma configuração ativa encontrada");
                return;
            }

            // Verifica se há cultos para a semana atual
            Calendar inicioSemana = Calendar.getInstance();
            inicioSemana.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
            inicioSemana.set(Calendar.HOUR_OF_DAY, 0);
            inicioSemana.set(Calendar.MINUTE, 0);
            inicioSemana.set(Calendar.SECOND, 0);
            inicioSemana.set(Calendar.MILLISECOND, 0);

            Calendar fimSemana = Calendar.getInstance();
            fimSemana.setTime(inicioSemana.getTime());
            fimSemana.add(Calendar.DAY_OF_MONTH, 7);
            fimSemana.add(Calendar.SECOND, -1);

            logger.info("📅 Verificando cultos para a semana: {} até {}", 
                inicioSemana.getTime(), fimSemana.getTime());

            // Gera cultos para a semana se necessário
            List<Culto> cultosGerados = gerarCultosParaPeriodo(inicioSemana.getTime(), fimSemana.getTime());
            
            if (!cultosGerados.isEmpty()) {
                logger.info("✅ Verificação semanal: {} cultos gerados para a semana", cultosGerados.size());
            } else {
                logger.info("ℹ️ Verificação semanal: Nenhum culto necessário para a semana");
            }
            
        } catch (Exception e) {
            logger.error("❌ Erro na verificação semanal de cultos: {}", e.getMessage(), e);
        }
    }

    /**
     * Job que roda todo dia às 00:05 da manhã
     * Verifica se há cultos para o dia atual e gera se necessário
     */
    @Scheduled(cron = "0 5 0 * * ?") // Todo dia às 00:05
    public void verificarCultosDiarios() {
        logger.info("🕐 Iniciando verificação diária de cultos...");
        
        try {
            // Busca configurações ativas
            List<CultoRecorrente> configsAtivas = cultoRecorrenteService.findAllAtivosVigentes();
            
            if (configsAtivas.isEmpty()) {
                logger.info("ℹ️ Nenhuma configuração ativa encontrada");
                return;
            }

            // Verifica se há cultos para hoje
            Calendar hoje = Calendar.getInstance();
            Calendar inicioDia = Calendar.getInstance();
            inicioDia.set(Calendar.HOUR_OF_DAY, 0);
            inicioDia.set(Calendar.MINUTE, 0);
            inicioDia.set(Calendar.SECOND, 0);
            inicioDia.set(Calendar.MILLISECOND, 0);

            Calendar fimDia = Calendar.getInstance();
            fimDia.setTime(inicioDia.getTime());
            fimDia.add(Calendar.DAY_OF_MONTH, 1);
            fimDia.add(Calendar.SECOND, -1);

            logger.info("📅 Verificando cultos para hoje: {}", hoje.getTime());

            // Gera cultos para hoje se necessário
            List<Culto> cultosGerados = gerarCultosParaPeriodo(inicioDia.getTime(), fimDia.getTime());
            
            if (!cultosGerados.isEmpty()) {
                logger.info("✅ Verificação diária: {} cultos gerados para hoje", cultosGerados.size());
            } else {
                logger.info("ℹ️ Verificação diária: Nenhum culto necessário para hoje");
            }
            
        } catch (Exception e) {
            logger.error("❌ Erro na verificação diária de cultos: {}", e.getMessage(), e);
        }
    }

    /**
     * Gera cultos para um período específico
     */
    private List<Culto> gerarCultosParaPeriodo(Date dataInicio, Date dataFim) {
        List<Culto> todosCultosGerados = new ArrayList<>();
        List<CultoRecorrente> cultosRecorrentes = cultoRecorrenteService.findAllAtivosVigentes();
        
        for (CultoRecorrente cultoRecorrente : cultosRecorrentes) {
            try {
                // Usa o método privado do CultoRecorrenteService
                List<Culto> cultosGerados = cultoRecorrenteService.gerarCultosParaPeriodo(cultoRecorrente, dataInicio, dataFim);
                todosCultosGerados.addAll(cultosGerados);
            } catch (Exception e) {
                logger.error("❌ Erro ao gerar cultos para configuração {}: {}", 
                    cultoRecorrente.getTitulo(), e.getMessage());
            }
        }
        
        return todosCultosGerados;
    }

    /**
     * Método manual para gerar cultos para o próximo mês (mantido para compatibilidade)
     */
    public List<Culto> gerarCultosProximoMesManual() {
        logger.info("🔄 Iniciando geração manual de cultos para o próximo mês...");
        
        try {
            List<Culto> cultosGerados = cultoRecorrenteService.gerarCultosProximoMes();
            logger.info("✅ Geração manual concluída: {} cultos gerados", cultosGerados.size());
            return cultosGerados;
        } catch (Exception e) {
            logger.error("❌ Erro na geração manual de cultos: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Método manual para gerar cultos para uma configuração específica
     */
    public List<Culto> gerarCultosParaConfiguracao(Long configId) {
        logger.info("🔄 Gerando cultos para configuração ID: {}", configId);
        
        try {
            List<Culto> cultosGerados = cultoRecorrenteService.gerarCultosRecorrentes(configId);
            logger.info("✅ Geração para configuração {} concluída: {} cultos gerados", 
                       configId, cultosGerados.size());
            return cultosGerados;
        } catch (Exception e) {
            logger.error("❌ Erro ao gerar cultos para configuração {}: {}", configId, e.getMessage(), e);
            throw e;
        }
    }
} 