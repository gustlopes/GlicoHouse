package br.edu.atitus.auth_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import br.edu.atitus.auth_service.dto.CartDTO;
import br.edu.atitus.auth_service.dto.CreateCartRequest;

@FeignClient(name = "Cart-service")
public interface cartClient {

    @PostMapping("/ws/cart/create")
    CartDTO create(@RequestBody CreateCartRequest req);

    @GetMapping("/ws/cart/by-user/{userId}")
    CartDTO findByUser(@PathVariable Long userId);
}
