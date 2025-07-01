package com.os.unirios.config;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.os.unirios.entities.Pessoa;
import com.os.unirios.entities.enums.StatusBatismo;
import com.os.unirios.entities.enums.StatusPessoa;
import com.os.unirios.entities.enums.TipoPessoa;
import com.os.unirios.repositories.PessoaRepository;

@Configuration
@Profile("!test") // Não executa durante os testes
public class DataInitializer {

    @Autowired
    private PessoaRepository pessoaRepository;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // Verifica se já existem pessoas no banco
            if (pessoaRepository.count() == 0) {
                System.out.println("Inicializando dados de pessoas...");
                insertSamplePessoas();
                System.out.println("Dados de pessoas inicializados com sucesso!");
            } else {
                System.out.println("Banco de dados já contém dados de pessoas. Pulando inicialização.");
            }
        };
    }

    private void insertSamplePessoas() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        
        try {
            // Pessoa 1 - Membro Ativo Batizado
            Pessoa pessoa1 = new Pessoa();
            pessoa1.setNomeCompleto("João Silva Santos");
            pessoa1.setDataNascimento(sdf.parse("1985-03-15"));
            pessoa1.setTelefone("(11) 99999-1111");
            pessoa1.setEmail("joao.silva@email.com");
            pessoa1.setEndereco("Rua das Flores, 123 - São Paulo/SP");
            pessoa1.setStatus(StatusPessoa.ATIVO);
            pessoa1.setTipo(TipoPessoa.MEMBRO);
            pessoa1.setStatusBatismo(StatusBatismo.BATIZADO);
            pessoa1.setDataBatismo(sdf.parse("2010-06-20"));
            pessoa1.setObservacoes("Membro ativo, participa regularmente dos cultos");
            
            // Pessoa 2 - Visitante Interessado
            Pessoa pessoa2 = new Pessoa();
            pessoa2.setNomeCompleto("Maria Oliveira Costa");
            pessoa2.setDataNascimento(sdf.parse("1992-07-22"));
            pessoa2.setTelefone("(11) 88888-2222");
            pessoa2.setEmail("maria.oliveira@email.com");
            pessoa2.setEndereco("Av. Paulista, 456 - São Paulo/SP");
            pessoa2.setStatus(StatusPessoa.ATIVO);
            pessoa2.setTipo(TipoPessoa.VISITANTE);
            pessoa2.setStatusBatismo(StatusBatismo.INTERESSADO);
            pessoa2.setDataInteresseBatismo(new Date());
            pessoa2.setObservacoes("Visitante interessada em conhecer mais sobre a igreja");
            
            // Pessoa 3 - Congregado Não Batizado
            Pessoa pessoa3 = new Pessoa();
            pessoa3.setNomeCompleto("Pedro Almeida Lima");
            pessoa3.setDataNascimento(sdf.parse("1978-11-08"));
            pessoa3.setTelefone("(11) 77777-3333");
            pessoa3.setEmail("pedro.almeida@email.com");
            pessoa3.setEndereco("Rua Augusta, 789 - São Paulo/SP");
            pessoa3.setStatus(StatusPessoa.ATIVO);
            pessoa3.setTipo(TipoPessoa.CONGREGADO);
            pessoa3.setStatusBatismo(StatusBatismo.NAO_BATIZADO);
            pessoa3.setObservacoes("Congregado há 2 anos, ainda não batizado");
            
            // Pessoa 4 - Interessado Pendente
            Pessoa pessoa4 = new Pessoa();
            pessoa4.setNomeCompleto("Ana Paula Ferreira");
            pessoa4.setDataNascimento(sdf.parse("1995-04-12"));
            pessoa4.setTelefone("(11) 66666-4444");
            pessoa4.setEmail("ana.ferreira@email.com");
            pessoa4.setEndereco("Rua Consolação, 321 - São Paulo/SP");
            pessoa4.setStatus(StatusPessoa.PENDENTE);
            pessoa4.setTipo(TipoPessoa.INTERESSADO);
            pessoa4.setStatusBatismo(StatusBatismo.NAO_BATIZADO);
            pessoa4.setObservacoes("Interessada em estudos bíblicos");
            
            // Pessoa 5 - Membro Inativo
            Pessoa pessoa5 = new Pessoa();
            pessoa5.setNomeCompleto("Carlos Eduardo Rocha");
            pessoa5.setDataNascimento(sdf.parse("1980-09-30"));
            pessoa5.setTelefone("(11) 55555-5555");
            pessoa5.setEmail("carlos.rocha@email.com");
            pessoa5.setEndereco("Rua 7 de Abril, 654 - São Paulo/SP");
            pessoa5.setStatus(StatusPessoa.INATIVO);
            pessoa5.setTipo(TipoPessoa.MEMBRO);
            pessoa5.setStatusBatismo(StatusBatismo.BATIZADO);
            pessoa5.setDataBatismo(sdf.parse("2005-12-10"));
            pessoa5.setObservacoes("Membro inativo, mudou-se para outra cidade");
            
            // Pessoa 6 - Visitante Ativo
            Pessoa pessoa6 = new Pessoa();
            pessoa6.setNomeCompleto("Fernanda Santos Rodrigues");
            pessoa6.setDataNascimento(sdf.parse("1988-12-25"));
            pessoa6.setTelefone("(11) 44444-6666");
            pessoa6.setEmail("fernanda.santos@email.com");
            pessoa6.setEndereco("Rua Bela Cintra, 987 - São Paulo/SP");
            pessoa6.setStatus(StatusPessoa.ATIVO);
            pessoa6.setTipo(TipoPessoa.VISITANTE);
            pessoa6.setStatusBatismo(StatusBatismo.NAO_BATIZADO);
            pessoa6.setObservacoes("Visitante frequente, participa dos eventos");
            
            // Pessoa 7 - Congregado Interessado em Batismo
            Pessoa pessoa7 = new Pessoa();
            pessoa7.setNomeCompleto("Roberto Carlos Silva");
            pessoa7.setDataNascimento(sdf.parse("1990-02-14"));
            pessoa7.setTelefone("(11) 33333-7777");
            pessoa7.setEmail("roberto.carlos@email.com");
            pessoa7.setEndereco("Av. Brigadeiro Faria Lima, 147 - São Paulo/SP");
            pessoa7.setStatus(StatusPessoa.ATIVO);
            pessoa7.setTipo(TipoPessoa.CONGREGADO);
            pessoa7.setStatusBatismo(StatusBatismo.INTERESSADO);
            pessoa7.setDataInteresseBatismo(sdf.parse("2024-01-15"));
            pessoa7.setObservacoes("Congregado interessado em batismo, participando dos estudos");
            
            // Pessoa 8 - Membro Ativo Recente
            Pessoa pessoa8 = new Pessoa();
            pessoa8.setNomeCompleto("Lucia Helena Martins");
            pessoa8.setDataNascimento(sdf.parse("1983-06-18"));
            pessoa8.setTelefone("(11) 22222-8888");
            pessoa8.setEmail("lucia.martins@email.com");
            pessoa8.setEndereco("Rua Oscar Freire, 258 - São Paulo/SP");
            pessoa8.setStatus(StatusPessoa.ATIVO);
            pessoa8.setTipo(TipoPessoa.MEMBRO);
            pessoa8.setStatusBatismo(StatusBatismo.BATIZADO);
            pessoa8.setDataBatismo(sdf.parse("2023-08-05"));
            pessoa8.setObservacoes("Membro recente, muito ativa na igreja");
            
            // Salva todas as pessoas
            pessoaRepository.saveAll(Arrays.asList(
                pessoa1, pessoa2, pessoa3, pessoa4, 
                pessoa5, pessoa6, pessoa7, pessoa8
            ));
            
        } catch (Exception e) {
            System.err.println("Erro ao inserir dados de pessoas: " + e.getMessage());
            e.printStackTrace();
        }
    }
} 