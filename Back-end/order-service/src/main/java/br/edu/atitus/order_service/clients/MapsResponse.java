package br.edu.atitus.order_service.clients;

import lombok.Data;

@Data
public class MapsResponse {
	
	private String cep;
	private String logradouro;
	private String bairro;
	private String cidade;
	private String uf;
}
