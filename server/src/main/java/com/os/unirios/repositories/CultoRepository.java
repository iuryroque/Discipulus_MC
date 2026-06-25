package com.os.unirios.repositories;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.os.unirios.entities.Culto;
import com.os.unirios.entities.Presenca;

@Repository
public interface  CultoRepository extends JpaRepository<Culto, Long>  , JpaSpecificationExecutor<Culto>{

    @Query("FROM Culto obj")
	public Page<Culto> cultoPage(Pageable pageable);
    
    List<Culto> findByPresenca(Presenca presenca);
    
    /**
     * Busca cultos por local e intervalo de data/hora
     */
    List<Culto> findByLocalAndDataHoraBetween(String local, Date dataInicio, Date dataFim);
    
    /**
     * Busca cultos por local e data/hora exata (com tolerância de 30 minutos)
     */
    @Query("SELECT c FROM Culto c WHERE c.local = ?1 AND c.dataHora BETWEEN ?2 AND ?3")
    List<Culto> findByLocalAndDataHoraProxima(String local, Date dataInicio, Date dataFim);
    
    /**
     * Busca cultos por título e período
     */
    @Query("SELECT c FROM Culto c WHERE c.titulo = ?1 AND c.dataHora BETWEEN ?2 AND ?3")
    List<Culto> findByTituloAndDataHoraBetween(String titulo, Date dataInicio, Date dataFim);
    
    /**
     * Busca cultos por tipo e período
     */
    @Query("SELECT c FROM Culto c WHERE c.tipo = ?1 AND c.dataHora BETWEEN ?2 AND ?3")
    List<Culto> findByTipoAndDataHoraBetween(String tipo, Date dataInicio, Date dataFim);
} 
