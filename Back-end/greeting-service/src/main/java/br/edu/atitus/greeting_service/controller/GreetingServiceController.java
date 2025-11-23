package br.edu.atitus.greeting_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.edu.atitus.greeting_service.configs.GreetingConfig;

@RestController
@RequestMapping("/greeting")
public class GreetingServiceController {

	private final GreetingConfig config;
	
	
	public GreetingServiceController(GreetingConfig config) {
		super();
		this.config = config;
	}

	@GetMapping({"","/","/name"})
	public ResponseEntity<String> GetgreetingService(@RequestParam(required = false) String name, @PathVariable(required = false) String namePath) {
		if (name == null)
			name = namePath != null ? namePath : config.getDefaultName();
		String textReturn = String.format("%s %s!!", config.getGreeting(),name);
		return ResponseEntity.ok(textReturn);
	}
}
