package br.edu.atitus.auth_service.controllers;

import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.atitus.auth_service.components.JwtUtil;
import br.edu.atitus.auth_service.dtos.SigninDTO;
import br.edu.atitus.auth_service.dtos.SigninResponseDTO;
import br.edu.atitus.auth_service.dtos.SignupDTO;
import br.edu.atitus.auth_service.entities.ResetToken;
import br.edu.atitus.auth_service.entities.UserEntity;
import br.edu.atitus.auth_service.entities.UserType;
import br.edu.atitus.auth_service.services.ResetTokenService;
import br.edu.atitus.auth_service.services.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

	private final UserService service;
	private final AuthenticationConfiguration authConfig;
	private final ResetTokenService resetTokenService;

	
	@PostMapping("/requestToken/create/{email}")
	public ResetToken createResetToken(@PathVariable String email) {
		return service.createRedefinicaoSenha(email);
	}
	
	@GetMapping("/requestToken/getToken/{Token}")
	public ResponseEntity<ResetToken> getByToken(@PathVariable String Token) {
		resetTokenService.findByToken(Token);
		return ResponseEntity.ok().build();
	}
	
	
	private UserEntity convertDTO2Entity(SignupDTO dto) {
		var user = new UserEntity();
		BeanUtils.copyProperties(dto, user);
		return user;
	}

	@PostMapping("/signup")
	public ResponseEntity<UserEntity> signup(@RequestBody SignupDTO dto) throws Exception {

		UserEntity user = convertDTO2Entity(dto);
		user.setType(UserType.Common);
		service.save(user);
		return ResponseEntity.status(HttpStatus.CREATED).body(user);

	}
	
	@PostMapping("/adm/signup")
	public ResponseEntity<UserEntity> signupAdm(@RequestBody SignupDTO dto) throws Exception {
		UserEntity user = convertDTO2Entity(dto);
		user.setType(UserType.Admin);
		service.save(user);
		return ResponseEntity.status(HttpStatus.CREATED).body(user);

	}

	@PostMapping("/signin")
	public ResponseEntity<SigninResponseDTO> PostSignin(@RequestBody SigninDTO signin)
			throws AuthenticationException, Exception {
		authConfig.getAuthenticationManager()
				.authenticate(new UsernamePasswordAuthenticationToken(signin.email(), signin.password()));
		UserEntity user = (UserEntity) service.loadUserByUsername(signin.email());
		SigninResponseDTO response = new SigninResponseDTO(user,
				JwtUtil.generateToken(user.getEmail(), user.getId(), user.getType()));
		return ResponseEntity.ok(response);

	}
	
	@GetMapping("/buscarPorEmail/{email}")
	public ResponseEntity<UserEntity> buscarPorEmail(@PathVariable String email) throws Exception {
		UserEntity user = (UserEntity) service.loadUserByUsername(email);
		return ResponseEntity.ok(user);
	}
	
	@PutMapping("/updatePassword/{token}/{newPassword}")
	public ResponseEntity<UserEntity> updatePassword(@PathVariable String token, @PathVariable String newPassword) throws Exception {
		UserEntity user = service.updatePassword(token, newPassword);
		return ResponseEntity.ok(user);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> handleException(Exception e) {
		String cleanMessage = e.getMessage().replaceAll("[\\r\\n]", " ");
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(cleanMessage);
	}

	@ExceptionHandler(AuthenticationException.class)
	public ResponseEntity<String> handleException(AuthenticationException e) {
		String cleanMessage = e.getMessage().replaceAll("[\\r\\n]", " ");
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(cleanMessage);
	}
}