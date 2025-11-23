package br.edu.atitus.email_service.entity;

import java.time.LocalDateTime;

import br.edu.atitus.email_service.dto.userRequest;
import lombok.Data;

@Data
public class RedefinirSenha {

	String token;
	userRequest usuario;
	LocalDateTime expiracao;
	
}
