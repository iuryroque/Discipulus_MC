package com.os.unirios.repositories;

import java.util.List;

import com.os.unirios.entities.LicoesConcluidasPessoa; 
import com.os.unirios.entities.Pessoa;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface  LicoesConcluidasPessoaRepository extends JpaRepository<LicoesConcluidasPessoa, Long>  , JpaSpecificationExecutor<LicoesConcluidasPessoa>{

    @Query("FROM LicoesConcluidasPessoa obj")
	public Page<LicoesConcluidasPessoa> licoesConcluidasPessoaPage(Pageable pageable);
} 
