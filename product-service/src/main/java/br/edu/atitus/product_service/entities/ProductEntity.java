package br.edu.atitus.product_service.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Data;

@Entity
@Table(name = "tb_product")
@Data
public class ProductEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String description;
	private String brand;
	private double price;
	private String model;
	private String currency;
	private Integer stock;
	private String especificacao;
	private String comoUsar;
	
	@Column(name = "image_url")
	private String imageUrl;

    @Column(name = "needs_prescription")
    private Boolean needsPrescription;
	
	@Transient
	private String environment;
	@Transient
	private double convertedPrice;
}