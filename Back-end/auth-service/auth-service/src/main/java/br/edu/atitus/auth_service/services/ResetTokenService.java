package br.edu.atitus.auth_service.services;

import org.springframework.stereotype.Service;

import br.edu.atitus.auth_service.entities.ResetToken;
import br.edu.atitus.auth_service.repositories.ResetTokenRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResetTokenService {
	private final ResetTokenRepository repository;

	public ResetToken findByToken(String token) {
		return repository.findByToken(token);
	}

	public ResetToken save(ResetToken token) {
		return repository.save(token);
	}

}
