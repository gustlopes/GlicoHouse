package br.edu.atitus.Cart_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import br.edu.atitus.Cart_service.DTO.ProductResponse;

@FeignClient(name = "product-service")
public interface ProductClient {

	@GetMapping("product/{idProduct}/{targetCurrency}")
	ProductResponse getProduct(@PathVariable Long idProduct,@PathVariable String targetCurrency);
}
