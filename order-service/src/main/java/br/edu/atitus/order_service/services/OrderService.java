package br.edu.atitus.order_service.services;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import br.edu.atitus.order_service.clients.CartClient;
import br.edu.atitus.order_service.clients.CartItemResponse;
import br.edu.atitus.order_service.clients.MapsClient;
import br.edu.atitus.order_service.clients.MapsResponse;
import br.edu.atitus.order_service.clients.cartResponse;
import br.edu.atitus.order_service.entities.OrderEntity;
import br.edu.atitus.order_service.repositories.OrderRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

//    private final OrderServiceApplication orderServiceApplication;
//    private final ProductClient productClient;
    private final OrderRepository orderRepository;
    private final CartClient cartClient;
    private final MapsClient mapsClient;

    public OrderEntity createOrder(Long userId,String cep) {
    	OrderEntity order = new OrderEntity();
    	cartResponse cart = cartClient.getCartByUserId(userId);
    	MapsResponse endereco = mapsClient.getendereco(cep);
    	if (orderRepository.existsByCartId(cart.getId())) {
            throw new IllegalStateException("Já existe um pedido criado para este carrinho.");
        }
    	double totalPrice = 0.0;
    	double totalConvertedPrice = 0.0;
    	order.setCarrinho(cart);
    	order.setCustomerId(userId);
    	order.setOrderDate(LocalDateTime.now());
    	order.setCartId(cart.getId());
    	
    	for(CartItemResponse item : order.getCarrinho().getItems()) { 
    		totalPrice += item.getProductPrice() * item.getQuantity();
    		totalConvertedPrice += item.getConvertedPrice() * item.getQuantity();
    		
    }
    	order.setTotalPrice(totalPrice);
    	order.setEndereco(endereco);
    	order.setTotalConvertedPrice(totalConvertedPrice);

        return orderRepository.save(order);
    }

//    public Page<OrderEntity> findOrdersByCustomerId(Long customerId, String targetCurrency, Pageable pageable) {
//    	Page<OrderEntity> orders = orderRepository.findByCustomerId(customerId, pageable);
//    
//    	
//    	for (OrderEntity order : orders) {
//    		double totalPrice = 0.0;
//        	double totalConvertedPrice = 0.0;
//        
//            for (OrderItemEntity item : order.getItems()) {
//                ProductResponse product = productClient.getProductById(item.getProductId());
//                item.setProduct(product);
//                totalPrice += item.getPriceAtPurchase() * item.getQuantity();
//                
//                CurrencyResponse currencyResponse = currencyClient.getCurrency(
//						item.getPriceAtPurchase(), item.getCurrencyAtPurchase(), targetCurrency);
//                item.setConvertedPriceAtPruchase(currencyResponse.getConvertedValue());
//                totalConvertedPrice += item.getConvertedPriceAtPruchase() * item.getQuantity();
//            }
//            order.setTotalPrice(totalPrice);
//            order.setTotalConvertedPrice(totalConvertedPrice);
//        }
//        return orders;
//    }
}
