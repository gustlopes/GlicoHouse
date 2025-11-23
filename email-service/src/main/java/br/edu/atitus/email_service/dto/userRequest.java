package br.edu.atitus.email_service.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;


@Data
public class userRequest {

	private Long id;

	private String name;

	private String email;

	@JsonIgnore
	private String password;

	private UserType type;
}
