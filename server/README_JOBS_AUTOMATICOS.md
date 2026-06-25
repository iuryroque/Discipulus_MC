# Sistema de Jobs Automáticos - Geração de Cultos

## Visão Geral

O sistema implementa jobs agendados para geração automática de cultos baseados nas configurações recorrentes ativas. Isso elimina a necessidade de geração manual e garante que os cultos sejam criados automaticamente.

## Jobs Implementados

### 1. Job Mensal
- **Agendamento**: Todo dia 1º do mês às 02:00 da manhã
- **Função**: Gera cultos para o mês atual baseado em todas as configurações ativas
- **Cron**: `0 0 2 1 * ?`
- **Método**: `gerarCultosMensalmente()`

### 2. Job Semanal
- **Agendamento**: Todo domingo às 06:00 da manhã
- **Função**: Verifica se há cultos para a semana atual e gera se necessário
- **Cron**: `0 0 6 ? * SUN`
- **Método**: `verificarCultosSemanais()`

### 3. Job Diário
- **Agendamento**: Todo dia às 00:05 da manhã
- **Função**: Verifica se há cultos para o dia atual e gera se necessário
- **Cron**: `0 5 0 * * ?`
- **Método**: `verificarCultosDiarios()`

## Configuração

### Habilitar Agendamento
O agendamento é habilitado na classe principal `UniriosApplication.java`:

```java
@SpringBootApplication
@EnableScheduling
public class UniriosApplication {
    // ...
}
```

### Serviço de Auto-Geração
O `CultoAutoGeneratorService` gerencia todos os jobs automáticos:

- **Logs detalhados**: Todos os jobs geram logs informativos
- **Tratamento de erros**: Exceções são capturadas e logadas
- **Verificação de duplicatas**: Evita gerar cultos duplicados
- **Flexibilidade**: Suporta geração manual quando necessário

## Funcionalidades

### Geração Inteligente
- **Período limitado**: Gera cultos apenas para o próximo mês (não para anos)
- **Verificação de existência**: Evita criar cultos duplicados
- **Configurações ativas**: Considera apenas configurações vigentes

### Logs e Monitoramento
- **Logs estruturados**: Usa SLF4J para logs organizados
- **Emojis informativos**: Facilita identificação visual nos logs
- **Estatísticas**: Mostra quantidade de cultos gerados

### Endpoints de Suporte
- `GET /culto-recorrente/status-jobs`: Informações sobre jobs ativos
- `POST /culto-recorrente/gerar-cultos-proximo-mes`: Geração manual
- `POST /culto-recorrente/{id}/gerar-cultos`: Geração para configuração específica

## Vantagens

### Automatização Completa
- **Sem intervenção manual**: Cultos são gerados automaticamente
- **Consistência**: Garante que todos os cultos sejam criados
- **Confiabilidade**: Jobs rodam mesmo se o sistema for reiniciado

### Flexibilidade
- **Geração manual**: Botão no Dashboard para geração sob demanda
- **Configurações específicas**: Pode gerar para configurações individuais
- **Períodos customizados**: Suporta diferentes intervalos de tempo

### Monitoramento
- **Logs detalhados**: Rastreamento completo das operações
- **Status dos jobs**: Informações sobre agendamentos ativos
- **Tratamento de erros**: Captura e loga problemas automaticamente

## Exemplo de Logs

```
🕐 Iniciando job de geração mensal de cultos...
📋 Encontradas 3 configurações ativas
📅 Culto gerado: Culto do Poder - 2025-01-05 19:30:00 - Perpétuo Socorro
📅 Culto gerado: Culto de Oração - 2025-01-08 20:00:00 - Perpétuo Socorro
✅ Job de geração mensal concluído: 8 cultos gerados
```

## Configuração de Cron

### Formato
```
segundo minuto hora dia-do-mês mês dia-da-semana
```

### Exemplos
- `0 0 2 1 * ?` - Todo dia 1º do mês às 02:00
- `0 0 6 ? * SUN` - Todo domingo às 06:00
- `0 5 0 * * ?` - Todo dia às 00:05

## Considerações de Produção

### Performance
- Jobs rodam em horários de baixo tráfego
- Geração limitada a períodos específicos
- Verificação de duplicatas para evitar sobrecarga

### Confiabilidade
- Tratamento robusto de exceções
- Logs detalhados para troubleshooting
- Jobs independentes para diferentes frequências

### Manutenção
- Código bem documentado
- Logs estruturados para monitoramento
- Endpoints para verificação de status 