package br.edu.atitus.Cart_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.atitus.Cart_service.Entity.cartEntity;

public interface cartRepository extends JpaRepository<cartEntity, Long> {

	boolean existsByUserId(Long userId);
	Optional<cartEntity> findByUserId(Long userId);
}
