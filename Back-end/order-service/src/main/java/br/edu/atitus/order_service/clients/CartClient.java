package br.edu.atitus.order_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "Cart-service")
public interface CartClient {

	
	@GetMapping("/ws/cart/by-user/{userId}")
	cartResponse getCartByUserId(@PathVariable Long userId);
}
