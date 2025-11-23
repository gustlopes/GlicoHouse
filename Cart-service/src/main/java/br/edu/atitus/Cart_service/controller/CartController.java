package br.edu.atitus.Cart_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.atitus.Cart_service.Entity.cartEntity;
import br.edu.atitus.Cart_service.service.cartService;
import lombok.RequiredArgsConstructor;

record CreateCartRequest(Long userId) {}

@RestController
@RequiredArgsConstructor
@RequestMapping("/ws/cart")
public class CartController {
	
	private final cartService service;
//	private final ProductClient client;
	
	
	@PostMapping("/create")
    public cartEntity create(@RequestBody CreateCartRequest req) {
        return service.existByUserIdAndCreate(req.userId());
    }

    @GetMapping("/by-user/{userId}")
    public cartEntity byUser(@PathVariable Long userId) {
        return service.existByUserIdAndCreate(userId);
    }
    
    @PostMapping("/additem/{ProductId}/{quantidade}/{currency}")
    public cartEntity AddItem(
    		@PathVariable Long ProductId,
    		@PathVariable String currency,
    		@PathVariable Integer quantidade,
    		@RequestHeader("X-User-Id") Long userId,
			@RequestHeader("X-User-Type") Integer userType) {
    	
    	
        return service.addItem(userId,ProductId,currency,quantidade);
    }
}
