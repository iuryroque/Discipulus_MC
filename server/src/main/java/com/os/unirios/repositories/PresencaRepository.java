package com.os.unirios.repositories;

import java.util.List;

import com.os.unirios.entities.Pessoa;
import com.os.unirios.entities.Presenca; 

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface  PresencaRepository extends JpaRepository<Presenca, Long>  , JpaSpecificationExecutor<Presenca>{

    @Query("FROM Presenca obj")
	public Page<Presenca> presencaPage(Pageable pageable);
    
    List<Presenca> findByPessoaOrderByCriadoEmDesc(Pessoa pessoa);
} 
