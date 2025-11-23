package br.edu.atitus.email_service.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ResetToken {

	private Long id;
	private String token;
	private LocalDateTime expiracao;
	private userRequest user;
}
