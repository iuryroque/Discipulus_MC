package com.os.unirios.config;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.os.unirios.entities.AcompanhamentoEstudo;
import com.os.unirios.entities.Alertas;
import com.os.unirios.entities.Presenca;
import com.os.unirios.entities.User;
import com.os.unirios.entities.enums.StatusPresenca;
import com.os.unirios.repositories.AcompanhamentoEstudoRepository;
import com.os.unirios.repositories.AlertasRepository;
import com.os.unirios.repositories.PresencaRepository;
import com.os.unirios.repositories.ProfileRepository;
import com.os.unirios.repositories.UserRepository;

@Configuration
public class Init implements CommandLineRunner {

    @Autowired
    ProfileRepository repoProfile;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AcompanhamentoEstudoRepository acompanhamentoEstudoRepository;

    @Autowired
    AlertasRepository alertasRepository;

    @Autowired
    PresencaRepository presencaRepository;

    @Override
    public void run(String... args) throws Exception {
    
        // Criar usuário master
        Optional<User> u = userRepository.findByUsername("master");

        if (u.isEmpty()) {
            User user = new User( "master",  "1",true);
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepository.save(user);
        }

        // Criar dados iniciais para AcompanhamentoEstudo
        if (acompanhamentoEstudoRepository.count() == 0) {
            AcompanhamentoEstudo acompanhamento = new AcompanhamentoEstudo();
            acompanhamento.setStatus("Ativo");
            acompanhamentoEstudoRepository.save(acompanhamento);
        }

        // Criar dados iniciais para Alertas
        if (alertasRepository.count() == 0) {
            Alertas alerta = new Alertas();
            alerta.setTitulo("Alerta Inicial");
            alerta.setMensagem("Alerta padrão do sistema");
            alerta.setTipo("Informação");
            alerta.setResolvido("Não");
            alertasRepository.save(alerta);
        }

        // Criar dados iniciais para Presenca
        if (presencaRepository.count() == 0) {
            Presenca presenca = new Presenca();
            presenca.setPresente(StatusPresenca.valueOf("SIM".trim().toUpperCase()));
            presenca.setObservacoes("Presença padrão");
            presencaRepository.save(presenca);
        }
        
    }

}
