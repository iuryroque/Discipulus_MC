package com.os.unirios.repositories;

import java.util.Optional;

import com.os.unirios.entities.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;



@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
	Optional<User> findByUsername(String username);

	Boolean existsByUsername(String username);
}
