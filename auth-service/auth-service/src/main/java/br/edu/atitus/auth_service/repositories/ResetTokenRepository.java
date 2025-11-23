package br.edu.atitus.auth_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.atitus.auth_service.entities.ResetToken;

@Repository
public interface ResetTokenRepository extends JpaRepository<ResetToken, Long> {

	ResetToken findByToken(String token);

}
