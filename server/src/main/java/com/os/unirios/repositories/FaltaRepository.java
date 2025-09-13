// src/main/java/com/os/unirios/repositories/FaltaRepository.java

package com.os.unirios.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.os.unirios.entities.Falta;

@Repository
public interface FaltaRepository extends JpaRepository<Falta, Long> {
}