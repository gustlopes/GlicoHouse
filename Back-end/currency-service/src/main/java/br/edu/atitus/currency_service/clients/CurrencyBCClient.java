package br.edu.atitus.currency_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "currencyBCClient"
, url = "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata",
fallback = CurrencyBCFallback.class)
public interface CurrencyBCClient {

	@GetMapping("/CotacaoDolarDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='USD'&@dataCotacao='today'&$format=json")
	CurrencyBCResponse getCurrency(String moeda);
}
