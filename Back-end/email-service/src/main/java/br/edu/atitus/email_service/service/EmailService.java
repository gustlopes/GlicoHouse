package br.edu.atitus.email_service.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import br.edu.atitus.email_service.client.User;
import br.edu.atitus.email_service.dto.ResetToken;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class EmailService {
	
	private final JavaMailSender mailSender;
	private final User client;
	
	public void enviarEmail(String destino,String token) {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

        try {
        	helper.setTo(destino);
            helper.setSubject("Redefinição de senha - GlicoHouse");

            String html = """
                    <!DOCTYPE html>
                    <html lang="pt-BR">
                    <head>
                        <meta charset="UTF-8">
                        <title>Redefinição de senha</title>
                    </head>
                    <body style="margin:0; padding:0; background-color:#f5f7fb; font-family:Arial, Helvetica, sans-serif;">
                        <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background-color:#f5f7fb; padding:20px 0;">
                            <tr>
                                <td align="center">
                                    <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="max-width:600px; background-color:#ffffff; border-radius:16px; overflow:hidden;">
                                        <tr>
                                            <td style="padding:24px 24px 32px 24px; background:linear-gradient(135deg,#03c6b4,#0080ff); color:#ffffff;">
                                                <div style="font-size:20px; font-weight:bold; margin-bottom:8px;">GlicoHouse</div>
                                                <div style="font-size:26px; font-weight:bold; margin-bottom:8px;">Cuide da sua saúde!</div>
                                                <div style="font-size:14px; opacity:0.9; margin-bottom:24px;">
                                                    Monitores e produtos para diabetes com até 25%% OFF.
                                                </div>
                                                <a href="#" style="display:inline-block; padding:10px 22px; background-color:#ffffff; color:#0080ff; text-decoration:none; border-radius:999px; font-size:14px; font-weight:bold;">
                                                    Ver ofertas
                                                </a>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="padding:24px 24px 8px 24px; font-size:18px; font-weight:bold; color:#222;">
                                                Redefinição de senha
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="padding:8px 24px 8px 24px; font-size:14px; color:#444; line-height:1.6;">
                                                Olá,
                                                <br><br>
                                                Recebemos uma solicitação para redefinir a senha da sua conta GlicoHouse.
                                                Use o código abaixo para continuar com o processo de redefinição:
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="padding:12px 24px 24px 24px;">
                                                <div style="text-align:center; margin:16px 0;">
                                                    <span style="display:inline-block; padding:12px 32px; border-radius:999px; background-color:#0080ff; color:#ffffff; font-size:18px; font-weight:bold; letter-spacing:0.12em;">
                                                        %s
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="padding:0 24px 24px 24px; font-size:14px; color:#444; line-height:1.6;">
                                                Se você não fez essa solicitação, pode ignorar este e-mail.
                                                <br><br>
                                                Um abraço,
                                                <br>
                                                Equipe GlicoHouse
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                    </html>
                    """.formatted(token);

           
    			helper.setText(html, true);
    			mailSender.send(mimeMessage);
    		
		} catch (Exception e) {
			e.printStackTrace();
		}
        
       
	}
	
	@Async("emailExecutor")
    public void enviarEmailRedefinicaoAsync(String destino, String token) {
        try {
        	enviarEmail(destino, token);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
	
	public void solicitarRedefinicaoSenha(String email) {
		ResetToken reset = client.createResetToken(email);

		enviarEmailRedefinicaoAsync(email, reset.getToken());
	}
}
