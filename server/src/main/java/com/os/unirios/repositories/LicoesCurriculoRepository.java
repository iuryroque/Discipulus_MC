package com.os.unirios.repositories;

import java.util.List;

import com.os.unirios.entities.CurriculoEstudo;
import com.os.unirios.entities.LicoesConcluidasPessoa;
import com.os.unirios.entities.LicoesCurriculo; 

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface  LicoesCurriculoRepository extends JpaRepository<LicoesCurriculo, Long>  , JpaSpecificationExecutor<LicoesCurriculo>{

    @Query("FROM LicoesCurriculo obj")
	public Page<LicoesCurriculo> licoesCurriculoPage(Pageable pageable);
    
    List<LicoesCurriculo> findByCurriculoEstudo(CurriculoEstudo curriculoEstudo);
    
    List<LicoesCurriculo> findByLicoesConcluidasPessoa(LicoesConcluidasPessoa licoesConcluidasPessoa);
} 
