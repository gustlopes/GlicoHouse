package br.edu.atitus.maps_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {
	@Bean
    WebClient viaCepWebClient() {
        return WebClient.builder()
                .baseUrl("https://viacep.com.br/ws")
                .build();
	}
}
