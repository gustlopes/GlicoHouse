package br.edu.atitus.email_service.client;

import java.util.Optional;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import br.edu.atitus.email_service.dto.ResetToken;
import br.edu.atitus.email_service.dto.userRequest;

@FeignClient(name = "auth-service")
public interface User {

	@GetMapping("/buscarPorEmail/{email}")
	Optional<userRequest> getUser(@PathVariable String email);
	
	@PutMapping("/updatePassword/{email}/{newPassword}")
	void updatePassword(@PathVariable String email, @PathVariable String newPassword);
	
	@GetMapping("/auth/requestToken/getToken/{Token}")
	ResetToken getByToken(@PathVariable String Token);
	
	@PostMapping("/auth/requestToken/create/{email}")
	ResetToken createResetToken(@PathVariable String email);
}
