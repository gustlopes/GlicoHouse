package br.edu.atitus.Cart_service.service;

import org.springframework.stereotype.Service;

import br.edu.atitus.Cart_service.DTO.ProductResponse;
import br.edu.atitus.Cart_service.Entity.CartItem;
import br.edu.atitus.Cart_service.Entity.cartEntity;
import br.edu.atitus.Cart_service.client.ProductClient;
import br.edu.atitus.Cart_service.repository.CartItemRepository;
import br.edu.atitus.Cart_service.repository.cartRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class cartService {

	private final cartRepository repository;
	private final CartItemRepository itemRepository;
	private final ProductClient client;

	@Transactional
	public cartEntity existByUserIdAndCreate(Long userId) {
		return repository.findByUserId(userId).orElseGet(() -> {
			cartEntity cart = new cartEntity();
			cart.setUserId(userId);
			return repository.save(cart);
		});
	}

//	public cartEntity findByUserId(Long userId) {
//		cartEntity cart = repository.findByUserId(userId).orElse(existByUserIdAndCreate(userId));
//		return cart;
//	}

	@Transactional
	public cartEntity addItem(Long userId, Long productId, String currency,Integer quantidade) {
		ProductResponse produto = client.getProduct(productId, currency);
		cartEntity carrinho = existByUserIdAndCreate(userId);
		CartItem item = itemRepository.findByCart_IdAndProductId(carrinho.getId(), productId).orElse(null);
		
		if (produto.getStock() < quantidade) {
			throw new IllegalArgumentException("Nao tem estoque suficiente");
		}
		
		if (item == null) {
			item = new CartItem();
			item.setCart(carrinho);
			item.setProductId(produto.getId());
			item.setProductName(produto.getDescription());
			item.setQuantity(quantidade);
			item.setProductPrice(produto.getPrice());
			item.setConvertedPrice(produto.getConvertedPrice());
			itemRepository.save(item);
		} else {
			item.setQuantity(item.getQuantity() + quantidade);
			itemRepository.save(item);
		}

		return carrinho;

	}

}
