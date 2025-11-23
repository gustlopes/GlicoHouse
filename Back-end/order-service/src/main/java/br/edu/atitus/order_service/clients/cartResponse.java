package br.edu.atitus.order_service.clients;

import java.util.List;

import lombok.Data;

@Data
public class cartResponse {

	private Long id;
	private Long userId;
	private List<CartItemResponse> items;
	
}
