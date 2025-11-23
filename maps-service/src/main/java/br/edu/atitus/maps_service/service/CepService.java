package br.edu.atitus.maps_service.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import br.edu.atitus.maps_service.DTO.EnderecoDTO;
import br.edu.atitus.maps_service.DTO.ViaCepResponse;

@Service
public class CepService {
    private final WebClient viaCepWebClient;

    public CepService(WebClient viaCepWebClient) {
        this.viaCepWebClient = viaCepWebClient;
    }

    public EnderecoDTO buscarPorCep(String cepBruto) {
        String cepLimpo = cepBruto.replaceAll("\\D", "");

        ViaCepResponse viaCepResponse = viaCepWebClient
                .get()
                .uri("/{cep}/json", cepLimpo)
                .retrieve()
                .bodyToMono(ViaCepResponse.class)
                .block();

        if (viaCepResponse == null || Boolean.TRUE.equals(viaCepResponse.getErro())) {
            throw new RuntimeException("CEP inválido ou não encontrado");
        }

        EnderecoDTO dto = new EnderecoDTO();
        dto.setCep(viaCepResponse.getCep());
        dto.setLogradouro(viaCepResponse.getLogradouro());
        dto.setBairro(viaCepResponse.getBairro());
        dto.setCidade(viaCepResponse.getCidade());
        dto.setUf(viaCepResponse.getUf());

        return dto;
    }
}
