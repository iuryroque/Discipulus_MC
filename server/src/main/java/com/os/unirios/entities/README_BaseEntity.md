# BaseEntity - Padronização de Campos de Auditoria

## Visão Geral

A `BaseEntity` é uma classe abstrata que fornece campos padrão de auditoria (`criadoEm` e `alteradoEm`) para todas as entidades do sistema. Isso garante consistência e automatiza o controle de criação e modificação de registros.

## Características

### Campos Automáticos
- **criadoEm**: Data/hora de criação (não pode ser alterado após criação)
- **alteradoEm**: Data/hora da última modificação (atualizado automaticamente)

### Funcionalidades
- **@PrePersist**: Define automaticamente `criadoEm` e `alteradoEm` na criação
- **@PreUpdate**: Atualiza automaticamente `alteradoEm` na modificação
- **@CreatedDate**: Anotação do Spring Data para auditoria de criação
- **@LastModifiedDate**: Anotação do Spring Data para auditoria de modificação

## Como Usar

### 1. Estender BaseEntity
```java
@Entity
@Table(name = "SUA_ENTIDADE")
public class SuaEntidade extends BaseEntity implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Seus campos específicos aqui...
    private String nome;
    private String descricao;
    
    // Construtor sem os campos de auditoria
    public SuaEntidade(Long id, String nome, String descricao) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        // criadoEm e alteradoEm são definidos automaticamente
    }
}
```

### 2. Remover Campos Duplicados
Remova os campos `criadoEm` e `alteradoEm` da sua entidade, pois eles já estão na classe base.

### 3. Atualizar Construtores
Remova os parâmetros `criadoEm` e `alteradoEm` dos construtores.

### 4. Atualizar Serviços
Remova as linhas que definem `criadoEm` e `alteradoEm` no método `updateData` dos serviços.

## Exemplo de Migração

### Antes
```java
@Entity
public class Pessoa implements Serializable {
    private Long id;
    private String nome;
    private Date criadoEm;      // ❌ Remover
    private Date alteradoEm;    // ❌ Remover
    
    public Pessoa(Long id, String nome, Date criadoEm, Date alteradoEm) {
        // ❌ Remover parâmetros de auditoria
    }
}
```

### Depois
```java
@Entity
public class Pessoa extends BaseEntity implements Serializable {
    private Long id;
    private String nome;
    // ✅ criadoEm e alteradoEm herdados da BaseEntity
    
    public Pessoa(Long id, String nome) {
        // ✅ Sem parâmetros de auditoria
    }
}
```

## Configuração Necessária

### 1. Habilitar JPA Auditing
A configuração já está habilitada em `AuditConfig.java`:
```java
@Configuration
@EnableJpaAuditing  // ✅ Já configurado
public class AuditConfig {
    // ...
}
```

### 2. EntityListeners
A `BaseEntity` já inclui o `AuditingEntityListener`:
```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)  // ✅ Já configurado
public abstract class BaseEntity {
    // ...
}
```

## Benefícios

1. **Consistência**: Todos os registros terão campos de auditoria padronizados
2. **Automação**: Não é necessário definir manualmente datas de criação/modificação
3. **Manutenibilidade**: Mudanças nos campos de auditoria afetam todas as entidades
4. **Integridade**: Garante que `criadoEm` nunca seja alterado após criação
5. **Rastreabilidade**: Facilita auditoria e debugging

## Migração de Entidades Existentes

Para migrar entidades existentes:

1. Estender `BaseEntity`
2. Remover campos `criadoEm` e `alteradoEm` duplicados
3. Atualizar construtores
4. Atualizar serviços (remover setters de auditoria)
5. Testar criação e atualização de registros

## Notas Importantes

- Os campos de auditoria são gerenciados automaticamente pelo JPA
- Não é necessário definir `criadoEm` e `alteradoEm` manualmente
- O campo `criadoEm` é definido apenas na criação e não pode ser alterado
- O campo `alteradoEm` é atualizado automaticamente em cada modificação 