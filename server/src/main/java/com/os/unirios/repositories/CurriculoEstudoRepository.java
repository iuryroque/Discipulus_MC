
package com.os.unirios.repositories;

import com.os.unirios.entities.CurriculoEstudo; 

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface  CurriculoEstudoRepository extends JpaRepository<CurriculoEstudo, Long>  , JpaSpecificationExecutor<CurriculoEstudo>{

    @Query("FROM CurriculoEstudo obj")
	public Page<CurriculoEstudo> curriculoEstudoPage(Pageable pageable);
    
} 
