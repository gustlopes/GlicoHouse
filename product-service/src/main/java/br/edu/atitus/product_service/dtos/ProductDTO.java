package br.edu.atitus.product_service.dtos;

public record ProductDTO(
    String description,
    String brand,
    String model,
    double price,
    String currency,
    Integer stock,
    String especificacao,
    String comoUsar,
    String imageUrl,
    String environment,
    double convertedPrice,
    Boolean needsPrescription){
}