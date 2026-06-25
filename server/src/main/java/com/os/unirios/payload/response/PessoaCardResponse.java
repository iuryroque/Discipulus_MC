package com.os.unirios.payload.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PessoaCardResponse {
    private Long id;
    private String nomeCompleto;
    private String tipo;
    private String status;
    private String telefone;
    private String email;
    
    // Último culto
    private String ultimoCultoNome;
    private Date ultimoCultoData;
    
    // Progresso de estudo
    private String curriculoEstudoNome;
    private Integer licaoAtual;
    private Integer totalLicoes;
    private String statusAcompanhamento;
    
    // Status de alerta
    private Boolean temAlertaAtivo;
    private String tipoAlerta;
    private Date dataUltimoAlerta;
    
    // Data do último contato (se disponível)
    private Date dataUltimoContato;
} 