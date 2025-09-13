
package com.os.unirios.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.os.unirios.entities.Pessoa;
import com.os.unirios.entities.enums.StatusPessoa;

@Repository
public interface  PessoaRepository extends JpaRepository<Pessoa, Long>  , JpaSpecificationExecutor<Pessoa>{

    @Query("FROM Pessoa obj")
	public Page<Pessoa> pessoaPage(Pageable pageable);

    List<Pessoa> findByStatus(StatusPessoa status);
    
} 
