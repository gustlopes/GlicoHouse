package br.edu.atitus.gateway_service;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApigatewayConfig {

	@Bean
	RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
		return builder.routes().route(p -> p.path("/get").uri("http://httpbin.org:80"))
				.route(p -> p.path("/product/**").uri("lb://product-service"))
				.route(p -> p.path("/ws/products/**").uri("lb://product-service"))
				.route(p -> p.path("/currency/**").uri("lb://currency-service"))
				.route(p -> p.path("/auth/**").uri("lb://auth-service"))
				.route(p -> p.path("/orders/**").uri("lb://order-service"))
				.route(p -> p.path("/ws/orders/**").uri("lb://order-service"))
				.route(p -> p.path("/greeting/**").uri("lb://greeting-service"))
				.route(p -> p.path("/ws/cart/**").uri("lb://Cart-service"))
				.route(p -> p.path("/email/**").uri("lb://email-service"))
				.route(p -> p.path("/enderecos/**").uri("lb://maps-service")).build();
	}
}
