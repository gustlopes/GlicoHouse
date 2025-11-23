package br.edu.atitus.order_service.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.atitus.order_service.entities.OrderEntity;
import br.edu.atitus.order_service.services.OrderService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ws/orders")
@RequiredArgsConstructor
public class OrderController {

	private final OrderService orderService;
//	private final ProductClient productClient;


	@PostMapping("/create/{cep}")
	public ResponseEntity<OrderEntity> createOrder(
			@PathVariable String cep,
			@RequestHeader("X-User-Id") Long userId,
			 @RequestHeader("X-User-Email") String userEmail,
			 @RequestHeader("X-User-Type") Integer userType) {
		
		OrderEntity order = orderService.createOrder(userId,cep);
		return ResponseEntity.status(HttpStatus.CREATED).body(order);
	}

//	@GetMapping("/{targetCurrency}")
//	public ResponseEntity<Page<OrderEntity>> listOrdersByUser(
//			@PathVariable String targetCurrency,
//			@PageableDefault(page = 0,size = 5,sort = "orderDate", direction = Direction.ASC) 
//				Pageable pageable,
//			@RequestHeader("X-User-Id") Long userId,
//			 @RequestHeader("X-User-Email") String userEmail,
//			 @RequestHeader("X-User-Type")Integer userType) {
//		targetCurrency = targetCurrency.toUpperCase();
//		Page<OrderEntity> orders = orderService.findOrdersByCustomerId(userId, targetCurrency, pageable);
//		return ResponseEntity.ok(orders);
//	}
}
