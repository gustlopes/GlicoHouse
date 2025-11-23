package br.edu.atitus.order_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "maps-service")
public interface MapsClient {

	@GetMapping("/enderecos/{cep}")
	MapsResponse getendereco(@PathVariable String cep);
	
}
