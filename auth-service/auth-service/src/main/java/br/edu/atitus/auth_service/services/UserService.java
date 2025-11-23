package br.edu.atitus.auth_service.services;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.atitus.auth_service.client.cartClient;
import br.edu.atitus.auth_service.components.Validator;
import br.edu.atitus.auth_service.dto.CreateCartRequest;
import br.edu.atitus.auth_service.entities.ResetToken;
import br.edu.atitus.auth_service.entities.UserEntity;
import br.edu.atitus.auth_service.entities.UserType;
import br.edu.atitus.auth_service.repositories.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
	private final UserRepository userRepository;
	private final PasswordEncoder encoder;
	private final cartClient client;
	private final ResetTokenService tokenService;
	
	public ResetToken createRedefinicaoSenha(String email) {
		ResetToken request = new ResetToken();
		UserEntity usuario = (UserEntity) loadUserByUsername(email);
		String token = UUID.randomUUID().toString();
		request.setToken(token);
		request.setUser(usuario);
		request.setExpiracao(LocalDateTime.now().plusHours(1));

		tokenService.save(request);
		
		return request;
	}

	private void validate(UserEntity user) throws Exception {
		if (user.getName() == null || user.getName().isEmpty())
			throw new Exception("Nome informado inválido");
		if (user.getEmail() == null || user.getEmail().isEmpty() || !Validator.validateEmail(user.getEmail()))
			throw new Exception("E-mail informado inválido");
		if (user.getPassword() == null || user.getPassword().isEmpty())
			throw new Exception("Senha informada inválida");

		if (user.getId() != null) {
			if (userRepository.existsByEmailAndIdNot(user.getEmail(), user.getId()))
				throw new Exception("Já existe usuário com este e-mail");
		} else {
			if (userRepository.existsByEmail(user.getEmail()))
				throw new Exception("Já existe usuário com este e-mail");
		}
		// TODO validar se usuário tem permissão para o tipo escolhido
	}

	private void format(UserEntity user) throws Exception {
		user.setPassword(encoder.encode(user.getPassword()));
	}

	@Transactional
	public UserEntity save(UserEntity user) throws Exception {
		if (user == null)
			throw new Exception("Objeto nulo");
		validate(user);
		format(user);
		UserEntity salvado = userRepository.save(user);
		if(user.getType() == UserType.Common) {
			try {
				client.create(new CreateCartRequest(salvado.getId()));	
			}
			catch (Exception e) {
				throw new Exception("Erro ao criar carrinho para o usuário: " + e.getMessage());
			}	
		}
		
		
		return salvado;
		
	}
	@Transactional
	public UserEntity updatePassword(String token ,String senhaNova)  throws Exception {
		ResetToken resetToken = tokenService.findByToken(token);	
		
		if(resetToken == null) {
			throw new Exception("Token inválido");
		}
		UserEntity user = resetToken.getUser();
		
		if (user == null)
			throw new Exception("Objeto nulo");
		if (user.getId() == null)
			throw new Exception("ID nulo para atualização");
		validate(user);
		user.setPassword(senhaNova);
		format(user);
		return userRepository.save(user);
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		var user = userRepository.findByEmail(username)
				.orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com este e-mail"));
		return user;
	}
}
