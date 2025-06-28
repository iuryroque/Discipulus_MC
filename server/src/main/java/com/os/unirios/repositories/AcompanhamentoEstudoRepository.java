
package com.os.unirios.repositories;

import com.os.unirios.entities.AcompanhamentoEstudo; 

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface  AcompanhamentoEstudoRepository extends JpaRepository<AcompanhamentoEstudo, Long>  , JpaSpecificationExecutor<AcompanhamentoEstudo>{

    @Query("FROM AcompanhamentoEstudo obj")
	public Page<AcompanhamentoEstudo> acompanhamentoEstudoPage(Pageable pageable);
    
} 
