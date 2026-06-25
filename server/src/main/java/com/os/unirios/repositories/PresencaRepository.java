package com.os.unirios.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.os.unirios.entities.Culto;
import com.os.unirios.entities.Pessoa;
import com.os.unirios.entities.Presenca;

@Repository
public interface  PresencaRepository extends JpaRepository<Presenca, Long>  , JpaSpecificationExecutor<Presenca>{

    @Query("FROM Presenca obj")
	public Page<Presenca> presencaPage(Pageable pageable);
    
    List<Presenca> findByPessoaOrderByCriadoEmDesc(Pessoa pessoa);
    boolean existsByPessoaAndCulto(Pessoa pessoa, Culto culto);
} 
