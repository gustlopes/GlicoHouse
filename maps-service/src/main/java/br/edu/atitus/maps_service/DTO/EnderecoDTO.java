package br.edu.atitus.maps_service.DTO;

import lombok.Data;

@Data
public class EnderecoDTO {
	private String cep;
	private String logradouro;
	private String bairro;
	private String cidade;
	private String uf;
}
