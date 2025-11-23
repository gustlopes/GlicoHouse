package br.edu.atitus.product_service.clients;

import lombok.Data;

@Data
public class CurrencyResponse {

	private Long id;
	
	private String source;
	
	private String target;
	
	private double conversionRate;
	
	private double convertedValue;
	
	private String environment;
	
}
