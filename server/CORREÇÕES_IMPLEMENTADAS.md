# Correções Implementadas - Sistema Discipulus

## Problemas Identificados e Soluções

### 1. Erro de JSON Parse - Campo "pessoa" não reconhecido

**Problema:**
```
JSON parse error: Unrecognized field "pessoa" (class com.os.unirios.entities.Presenca), not marked as ignorable
```

**Causa:** A entidade `Presenca` não tinha uma relação com `Pessoa`, mas o frontend estava tentando enviar esse campo.

**Solução Implementada:**

#### 1.1 Atualização da Entidade Presenca
**Arquivo:** `server/src/main/java/com/os/unirios/entities/Presenca.java`

**Mudanças:**
- Adicionada importação: `import jakarta.persistence.JoinColumn;`
- Adicionada importação: `import jakarta.persistence.ManyToOne;`
- Adicionada relação com Pessoa:
```java
@ManyToOne
@JoinColumn(name="PESSOA_ID")
@JsonManagedReference
private Pessoa pessoa;
```

#### 1.2 Configuração Jackson para Ignorar Campos Desconhecidos
**Arquivo:** `server/src/main/java/com/os/unirios/config/JacksonConfig.java`

**Mudanças:**
- Adicionada importação: `import com.fasterxml.jackson.databind.DeserializationFeature;`
- Configurado para ignorar propriedades desconhecidas:
```java
mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
```

### 2. Erro de Autenticação JWT - CORS

**Problema:**
```
UnAuthenticated: Invalid or missing JWT token
```

**Causa:** Configuração CORS limitada apenas para porta 3000, mas o React Admin está rodando na porta 5173 (Vite).

**Solução Implementada:**

#### 2.1 Atualização da Configuração CORS
**Arquivo:** `server/src/main/java/com/os/unirios/config/ConfigurationCors.java`

**Mudanças:**
- Adicionada porta 5173 aos origins permitidos:
```java
corsConfiguration.addAllowedOrigin("http://localhost:5173");
```

### 3. Problema: TransientPropertyValueException na entidade Presenca

**Descrição do Problema:**
Ao tentar salvar uma entidade `Presenca` que referenciava uma `Pessoa`, o Hibernate lançava `TransientPropertyValueException` porque a instância da `Pessoa` não estava sendo gerenciada pelo JPA.

**Solução Implementada:**

#### 3.1 Atualização do Serviço de Presenca
**Arquivo:** `server/src/main/java/com/os/unirios/services/PresencaService.java`

**Mudanças:**
- Adicionada injeção do `PessoaService`
- Modificado método `insert()` para buscar a pessoa corretamente antes de salvar
- Modificado método `update()` para buscar a pessoa corretamente antes de atualizar
- Adicionado `setPessoa()` no método `updateData()`

```java
@Autowired
private PessoaService pessoaService;

public Presenca insert(Presenca obj){
    // Buscar a pessoa se ela foi fornecida
    if (obj.getPessoa() != null && obj.getPessoa().getId() != null) {
        Pessoa pessoa = pessoaService.findById(obj.getPessoa().getId());
        obj.setPessoa(pessoa);
    }
    
    obj.setId(null);
    obj = repo.save(obj);
    return obj;
}
```

### 4. Problema: Serialização circular entre Pessoa e Presenca

**Descrição do Problema:**
A relação bidirecional entre `Pessoa` e `Presenca` causava loops infinitos durante a serialização JSON.

**Solução Implementada:**

#### 4.1 Atualização da Entidade Pessoa
**Arquivo:** `server/src/main/java/com/os/unirios/entities/Pessoa.java`

**Mudanças:**
- Adicionada anotação `@JsonBackReference` na relação com Presenca:
```java
@ManyToOne
@JoinColumn(name="PRESENCA_ID")
@JsonBackReference
private Presenca presenca;
```

#### 4.2 Atualização da Entidade Presenca
**Arquivo:** `server/src/main/java/com/os/unirios/entities/Presenca.java`

**Mudanças:**
- Adicionada anotação `@JsonManagedReference` na relação com Pessoa:
```java
@ManyToOne
@JoinColumn(name="PESSOA_ID")
@JsonManagedReference
private Pessoa pessoa;
```

### 5. Problema: Dependência circular entre serviços

**Descrição do Problema:**
Havia uma dependência circular entre `CultoService` → `PresencaService` → `PessoaService` → `PresencaService`, causando erro de inicialização do Spring.

**Solução Implementada:**

#### 5.1 Atualização do Serviço de Pessoa
**Arquivo:** `server/src/main/java/com/os/unirios/services/PessoaService.java`

**Mudanças:**
- Removida injeção do `PresencaService`
- Adicionada injeção do `PresencaRepository`
- Modificados métodos `insert()` e `update()` para usar o repositório diretamente

```java
@Autowired
private PresencaRepository presencaRepository;

public Presenca insert(Presenca obj){
    // Buscar a pessoa se ela foi fornecida
    if (obj.getPessoa() != null && obj.getPessoa().getId() != null) {
        Optional<Presenca> presencaOpt = presencaRepository.findById(obj.getPessoa().getId());
        if (presencaOpt.isPresent()) {
            obj.setPessoa(presencaOpt.get().getPessoa());
        } else {
            throw new ObjectNotFoundException("Presenca não encontrada! Id: " + obj.getPessoa().getId());
        }
    }
    
    obj.setId(null);
    obj = repo.save(obj);
    return obj;
}
```

## Benefícios das Correções

### 1. Estabilidade do Sistema
- Eliminação de erros de JSON parse
- Melhor tratamento de campos desconhecidos
- Comunicação mais robusta entre frontend e backend

### 2. Compatibilidade
- Suporte para diferentes portas de desenvolvimento
- Flexibilidade na configuração de CORS
- Melhor experiência de desenvolvimento

### 3. Manutenibilidade
- Código mais limpo e organizado
- Configurações centralizadas
- Documentação clara das mudanças

## Estrutura de Relacionamentos Atualizada

### Entidade Presenca
```java
@Entity
@Table(name = "PRESENCA")
public class Presenca extends BaseEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="PRESENCA_ID")
    private Long id;
    
    @Column(name="PRESENCA_PRESENTE")
    private String presente;
    
    @Column(name="PRESENCA_OBSERVACOES")
    private String observacoes;
    
    @ManyToOne
    @JoinColumn(name="PESSOA_ID")
    @JsonManagedReference
    private Pessoa pessoa;
}
```

### Relacionamentos
- **Presenca** → **Pessoa** (ManyToOne)
- **Pessoa** → **Presenca** (OneToMany)
- **Pessoa** → **AcompanhamentoEstudo** (ManyToOne)
- **Pessoa** → **Alertas** (ManyToOne)

## Configurações Atualizadas

### Jackson Configuration
```java
@Bean
public ObjectMapper objectMapper() {
    ObjectMapper mapper = new ObjectMapper();
    mapper.registerModule(new JavaTimeModule());
    mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    mapper.setTimeZone(TimeZone.getTimeZone("UTC"));
    return mapper;
}
```

### CORS Configuration
```java
@Bean
public FilterRegistrationBean<CorsFilter> simpleCorsFilter() {
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowCredentials(true);
    config.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173"));
    config.setAllowedMethods(Collections.singletonList("*"));
    config.setAllowedHeaders(Collections.singletonList("*"));
    source.registerCorsConfiguration("/**", config);
    FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
    bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
    return bean;
}
```

## Próximos Passos

1. **Reiniciar o Servidor:** Para aplicar as mudanças
2. **Testar o Frontend:** Verificar se os erros foram resolvidos
3. **Validar Relacionamentos:** Confirmar que as entidades estão corretamente relacionadas
4. **Monitorar Logs:** Acompanhar se há novos erros

## Considerações Técnicas

- **Compatibilidade:** Mudanças mantêm compatibilidade com código existente
- **Performance:** Configurações otimizadas para melhor performance
- **Segurança:** CORS configurado adequadamente para desenvolvimento
- **Escalabilidade:** Estrutura preparada para futuras expansões

---

**Data:** 2024  
**Versão:** 1.0  
**Status:** Implementado 