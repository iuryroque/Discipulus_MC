
package com.os.unirios.repositories;

import com.os.unirios.entities.Culto; 

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface  CultoRepository extends JpaRepository<Culto, Long>  , JpaSpecificationExecutor<Culto>{

    @Query("FROM Culto obj")
	public Page<Culto> cultoPage(Pageable pageable);
    
} 
