package br.edu.atitus.order_service.clients;

import lombok.Data;

@Data
public class CurrencyResponse {

	private Long id;

	private String source;

	private String target;

	private double conversionRate;

	private double convertedValue;
	
	private String enviroment;
	
}
