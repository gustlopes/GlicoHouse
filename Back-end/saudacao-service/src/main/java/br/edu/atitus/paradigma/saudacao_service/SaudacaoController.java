package br.edu.atitus.paradigma.saudacao_service;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.atitus.paradigma.saudacao_service.config.SaudacaoConfig;

@RestController
@RequestMapping("Ola")
public class SaudacaoController {

	private final SaudacaoConfig config;
	
	
	public SaudacaoController(SaudacaoConfig config) {
		super();
		this.config = config;
	}


	@GetMapping({"" ,"/{nome}"})
	public ResponseEntity<String> getSaudacao(@PathVariable String nome){
		return ResponseEntity.ok(config.getSaudacao() + nome + "!");
	}
}
