package br.edu.atitus.currency_service.clients;

import java.util.List;

import lombok.Data;

@Data
public class CurrencyBCResponse {
	
	private List<CurrencyBC> value;
	
	@Data
	public static class CurrencyBC {
		private double cotacaoVenda;
	}
	
}
