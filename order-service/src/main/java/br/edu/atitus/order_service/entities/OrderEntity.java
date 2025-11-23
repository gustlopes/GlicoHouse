package br.edu.atitus.order_service.entities;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import br.edu.atitus.order_service.clients.MapsResponse;
import br.edu.atitus.order_service.clients.cartResponse;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Data;

@Entity
@Table(name = "tb_order")
@Data
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime orderDate;

    @Column(nullable = false)
    @JsonIgnore
    private Long customerId;

    @Transient
    private cartResponse carrinho;
    
    @Transient
    private double totalPrice;
    
    @Column(name = "cart_id", unique = true)
    private Long cartId;

    
    @Transient
    private double totalConvertedPrice;
    
    @Transient
    private MapsResponse endereco;
   
}
