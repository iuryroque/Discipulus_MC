package com.os.unirios.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.os.unirios.entities.CultoRecorrente;

@Repository
public interface CultoRecorrenteRepository extends JpaRepository<CultoRecorrente, Long> {
    
    @Query("SELECT cr FROM CultoRecorrente cr WHERE cr.ativo = true")
    List<CultoRecorrente> findAllAtivos();
    
    @Query("SELECT cr FROM CultoRecorrente cr WHERE cr.ativo = true AND (cr.dataFim IS NULL OR cr.dataFim >= CURRENT_DATE)")
    List<CultoRecorrente> findAllAtivosVigentes();
    
    @Query("SELECT cr FROM CultoRecorrente cr WHERE cr.ativo = true AND cr.dataInicio <= :data AND (cr.dataFim IS NULL OR cr.dataFim >= :data)")
    List<CultoRecorrente> findAllAtivosPorData(@Param("data") java.util.Date data);
} 