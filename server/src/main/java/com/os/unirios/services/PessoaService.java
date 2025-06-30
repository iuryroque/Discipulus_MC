package com.os.unirios.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

import com.os.unirios.entities.AcompanhamentoEstudo;
import com.os.unirios.entities.Alertas;
import com.os.unirios.entities.CurriculoEstudo;
import com.os.unirios.entities.LicoesConcluidasPessoa;
import com.os.unirios.entities.LicoesCurriculo;
import com.os.unirios.entities.Pessoa;
import com.os.unirios.entities.Presenca;
import com.os.unirios.entities.Culto;
import com.os.unirios.payload.response.PessoaCardResponse;
import com.os.unirios.repositories.CurriculoEstudoRepository;
import com.os.unirios.repositories.LicoesConcluidasPessoaRepository;
import com.os.unirios.repositories.LicoesCurriculoRepository;
import com.os.unirios.repositories.PessoaRepository;
import com.os.unirios.repositories.PresencaRepository;
import com.os.unirios.repositories.CultoRepository;
import com.os.unirios.services.exceptions.DataIntegrityException;
import com.os.unirios.services.exceptions.ObjectNotFoundException;

        
@Service
public class PessoaService {

    @Autowired
    private PessoaRepository repo;

    @Autowired
    private PresencaRepository presencaRepository;

    @Autowired
    private CurriculoEstudoRepository curriculoEstudoRepository;

    @Autowired
    private LicoesCurriculoRepository licoesCurriculoRepository;

    @Autowired
    private LicoesConcluidasPessoaRepository licoesConcluidasPessoaRepository;

    @Autowired
    private CultoRepository cultoRepository;

   
                        @Autowired 
                        private AcompanhamentoEstudoService acompanhamentoEstudoService;
                      

                        @Autowired 
                        private AlertasService alertasService;
                      

   private final GenericSpecificationUtil<Pessoa> specUtil = new GenericSpecificationUtil<>();

            
    public List<Pessoa> findAll(){
        return repo.findAll();
    }

    public Page<Pessoa> findPage(Integer page, Integer linesPerPage, String orderBy, String direction) {

		PageRequest pageRequest = PageRequest.of(page, linesPerPage, Direction.valueOf(direction), orderBy);
		
		return repo.pessoaPage(pageRequest);
	
    }

    public Page<Pessoa> findPageWithFilters(Integer page, Integer linesPerPage, String orderBy, String direction, String filter) {
        
  
        return specUtil.findWithFilters(page, linesPerPage, orderBy, direction, filter, repo);
    }

    public Pessoa findById(Long id){
        Optional<Pessoa> obj = repo.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException(
				"Objeto não encontrado! Id: " + id + ", Tipo: " + Pessoa.class.getName()));
    }

    public Pessoa insert(Pessoa obj){
        
        if (obj.getAcompanhamentoEstudo() != null && obj.getAcompanhamentoEstudo().getId() != null) {
            AcompanhamentoEstudo acompanhamentoEstudo = acompanhamentoEstudoService.findById(obj.getAcompanhamentoEstudo().getId());
            obj.setAcompanhamentoEstudo(acompanhamentoEstudo);
        }

        if (obj.getAlertas() != null && obj.getAlertas().getId() != null) {
            Alertas alertas = alertasService.findById(obj.getAlertas().getId());
            obj.setAlertas(alertas);
        }

        if (obj.getPresenca() != null && obj.getPresenca().getId() != null) {
            final Long presencaId = obj.getPresenca().getId();
            Optional<Presenca> presencaOpt = presencaRepository.findById(presencaId);
            Presenca presenca = presencaOpt.orElseThrow(() -> new ObjectNotFoundException(
                "Presenca não encontrada! Id: " + presencaId));
            obj.setPresenca(presenca);
        }
        
        obj.setId(null);
        obj = repo.save(obj); // salvar e obter objeto monitorado
        return obj;
    }
        
    public Pessoa delete(Long id) {
        Pessoa obj = findById(id);//ou existe, ou irá gerar exception
         try {
			repo.deleteById(id);
		} catch (DataIntegrityViolationException e) {
			throw new DataIntegrityException(
					"Não é possível excluir este registro de Pessoa pois possui vinculos com outros registros");
		}
        return obj;
    }
        
    public Pessoa update(Pessoa obj) {
        
        // Criar uma cópia do objeto para evitar problemas de finalidade
        final Pessoa objCopy = new Pessoa();
        objCopy.setId(obj.getId());
        objCopy.setNomeCompleto(obj.getNomeCompleto());
        objCopy.setDataNascimento(obj.getDataNascimento());
        objCopy.setTelefone(obj.getTelefone());
        objCopy.setEmail(obj.getEmail());
        objCopy.setEndereco(obj.getEndereco());
        objCopy.setStatus(obj.getStatus());
        objCopy.setTipo(obj.getTipo());
        objCopy.setStatusBatismo(obj.getStatusBatismo());
        objCopy.setDataInteresseBatismo(obj.getDataInteresseBatismo());
        objCopy.setDataBatismo(obj.getDataBatismo());
        objCopy.setObservacoes(obj.getObservacoes());
        objCopy.setAcompanhamentoEstudo(obj.getAcompanhamentoEstudo());
        objCopy.setAlertas(obj.getAlertas());
        objCopy.setPresenca(obj.getPresenca());
        
        if (objCopy.getAcompanhamentoEstudo() != null && objCopy.getAcompanhamentoEstudo().getId() != null) {
            AcompanhamentoEstudo acompanhamentoEstudo = acompanhamentoEstudoService.findById(objCopy.getAcompanhamentoEstudo().getId());
            objCopy.setAcompanhamentoEstudo(acompanhamentoEstudo);
        }

        if (objCopy.getAlertas() != null && objCopy.getAlertas().getId() != null) {
            Alertas alertas = alertasService.findById(objCopy.getAlertas().getId());
            objCopy.setAlertas(alertas);
        }

        if (objCopy.getPresenca() != null && objCopy.getPresenca().getId() != null) {
            Optional<Presenca> presencaOpt = presencaRepository.findById(objCopy.getPresenca().getId());
            if (presencaOpt.isPresent()) {
                objCopy.setPresenca(presencaOpt.get());
            } else {
                throw new ObjectNotFoundException("Presenca não encontrada! Id: " + objCopy.getPresenca().getId());
            }
        }

        Pessoa newObj = findById(objCopy.getId());
        
        

        updateData(newObj, objCopy);
        
        return repo.save(newObj);          
    }

    private void updateData(Pessoa newObj, Pessoa obj) {
        
                        newObj.setAcompanhamentoEstudo(obj.getAcompanhamentoEstudo());

                        newObj.setAlertas(obj.getAlertas());

                        newObj.setPresenca(obj.getPresenca());
        newObj.setId(obj.getId());
            newObj.setNomeCompleto(obj.getNomeCompleto());
            newObj.setDataNascimento(obj.getDataNascimento());
            newObj.setTelefone(obj.getTelefone());
            newObj.setEmail(obj.getEmail());
            newObj.setEndereco(obj.getEndereco());
            newObj.setStatus(obj.getStatus());
            newObj.setTipo(obj.getTipo());
            newObj.setStatusBatismo(obj.getStatusBatismo());
            newObj.setDataInteresseBatismo(obj.getDataInteresseBatismo());
            newObj.setDataBatismo(obj.getDataBatismo());
            newObj.setObservacoes(obj.getObservacoes());
            
    }

    public Page<PessoaCardResponse> findPessoasComCards(Integer page, Integer linesPerPage, String orderBy, String direction, String filter) {
        Page<Pessoa> pessoasPage = findPageWithFilters(page, linesPerPage, orderBy, direction, filter);
        
        List<PessoaCardResponse> cards = pessoasPage.getContent().stream()
            .map(this::enriquecerPessoaComDados)
            .collect(Collectors.toList());
        
        return new PageImpl<>(cards, pessoasPage.getPageable(), pessoasPage.getTotalElements());
    }

    private PessoaCardResponse enriquecerPessoaComDados(Pessoa pessoa) {
        PessoaCardResponse card = new PessoaCardResponse();
        
        // Dados básicos da pessoa
        card.setId(pessoa.getId());
        card.setNomeCompleto(pessoa.getNomeCompleto());
        card.setTipo(pessoa.getTipo());
        card.setStatus(pessoa.getStatus());
        card.setTelefone(pessoa.getTelefone());
        card.setEmail(pessoa.getEmail());
        
        // Último culto
        buscarUltimoCulto(pessoa, card);
        
        // Progresso de estudo
        buscarProgressoEstudo(pessoa, card);
        
        // Status de alerta
        buscarStatusAlerta(pessoa, card);
        
        return card;
    }

    private void buscarUltimoCulto(Pessoa pessoa, PessoaCardResponse card) {
        // Buscar a última presença da pessoa
        List<Presenca> presencas = presencaRepository.findByPessoaOrderByCriadoEmDesc(pessoa);
        
        if (!presencas.isEmpty()) {
            Presenca ultimaPresenca = presencas.get(0);
            // Buscar o culto que tem esta presença
            // Como a relação é inversa (Culto -> Presenca), precisamos buscar cultos que referenciam esta presença
            List<Culto> cultos = cultoRepository.findByPresenca(ultimaPresenca);
            
            if (!cultos.isEmpty()) {
                Culto ultimoCulto = cultos.get(0);
                card.setUltimoCultoNome(ultimoCulto.getNome());
                card.setUltimoCultoData(ultimoCulto.getDataHora());
            }
        }
    }

    private void buscarProgressoEstudo(Pessoa pessoa, PessoaCardResponse card) {
        if (pessoa.getAcompanhamentoEstudo() != null) {
            AcompanhamentoEstudo acompanhamento = pessoa.getAcompanhamentoEstudo();
            card.setStatusAcompanhamento(acompanhamento.getStatus());
            
            // Para simplificar, vamos apenas mostrar o status do acompanhamento
            // e deixar o progresso como informação básica
            card.setCurriculoEstudoNome("Acompanhamento Ativo");
            card.setLicaoAtual(0);
            card.setTotalLicoes(0);
        }
    }

    private void buscarStatusAlerta(Pessoa pessoa, PessoaCardResponse card) {
        if (pessoa.getAlertas() != null) {
            Alertas alerta = pessoa.getAlertas();
            card.setTemAlertaAtivo("N".equals(alerta.getResolvido()));
            card.setTipoAlerta(alerta.getTipo());
            card.setDataUltimoAlerta(alerta.getDataAlerta());
        } else {
            card.setTemAlertaAtivo(false);
        }
    }
}
