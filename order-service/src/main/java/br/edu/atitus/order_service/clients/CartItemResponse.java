package br.edu.atitus.order_service.clients;

import lombok.Data;

@Data
public class CartItemResponse {
	private Long id;
	private Long productId;
	private String productName;
	private Double productPrice;
	private Integer quantity;
	private Double convertedPrice;
}
