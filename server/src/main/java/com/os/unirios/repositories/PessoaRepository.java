
package com.os.unirios.repositories;

import com.os.unirios.entities.Pessoa; 

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface  PessoaRepository extends JpaRepository<Pessoa, Long>  , JpaSpecificationExecutor<Pessoa>{

    @Query("FROM Pessoa obj")
	public Page<Pessoa> pessoaPage(Pageable pageable);
    
} 
