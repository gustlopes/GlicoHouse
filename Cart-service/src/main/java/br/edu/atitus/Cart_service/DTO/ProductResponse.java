package br.edu.atitus.Cart_service.DTO;

import lombok.Data;

@Data
public class ProductResponse {

	private Long id;
	private Double price;
	private Integer stock;
	private String description;
	private Double convertedPrice;
	private Boolean needPrescription;
}
