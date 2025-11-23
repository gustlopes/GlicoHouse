package br.edu.atitus.currency_service.clients;

import java.util.Collections;

import org.springframework.stereotype.Component;

@Component
public class CurrencyBCFallback implements CurrencyBCClient {

	@Override
	public CurrencyBCResponse getCurrency(String moeda) {
		CurrencyBCResponse response = new CurrencyBCResponse();
		response.setValue(Collections.emptyList());
		return response;
	}

	

}
