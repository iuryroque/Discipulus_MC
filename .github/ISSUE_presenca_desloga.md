# Bug: Ao salvar presença, o sistema desloga o usuário

Resumo
-------
Ao tentar gravar presenças (endpoint `presenca` / `presenca/bulk`, interface de presença), o usuário é deslogado automaticamente e redirecionado para a tela de login.

Impacto
-------
- Usuários perdem a sessão ao salvar presenças.
- Dados de presença podem não ser persistidos.
- Experiência de usuário degradada e bloqueio de operação de check-in.

Reproduzir
---------
1. Faça login no sistema (ex.: /#/login).
2. Acesse a tela de Presença (ex.: /#/presenca).
3. Selecione um culto e marque algumas presenças.
4. Clique em "Salvar" (o botão que chama o endpoint `presenca/bulk` no frontend).
5. Observação: o app redireciona para a tela de login e a sessão do usuário foi encerrada.

Comportamento esperado
----------------------
- Ao salvar presenças, o backend deve retornar 200/201 e o frontend deve mostrar uma mensagem de sucesso sem encerrar a sessão.

Comportamento observado
-----------------------
- O frontend é redirecionado para a tela de login.
- Nenhuma mensagem de erro clara é exibida no frontend.

Informações úteis / diagnóstico inicial
-------------------------------------
- Arquivo frontend relacionado: `client/src/forms/Presenca/presencaList.jsx` (método que monta payload e faz `dataProvider.create('presenca/bulk', { data: payload })`).
- Endpoint chamado: `presenca/bulk` (ver `dataProvider.create` custom endpoint).
- Possíveis sinais no console do navegador: código 401/403 em resposta à chamada, ou erro de CORS, ou token expirado.
- Logs do backend podem mostrar `401 Unauthorized` ou `Invalid token`.

Possíveis causas
----------------
1. Token de autenticação expirando ou não sendo enviado no request (Authorization header ausente).
2. O endpoint `presenca/bulk` retorna 401/403 quando há dados inválidos ou falta de permissão, e o frontend trata isso redirecionando ao login.
3. Falha no refresh do token (se houver refresh flow) — refresh não acionado e app entra em estado não autenticado.
4. CORS ou configuração de sessão do backend que invalida cookies de sessão.
5. Exceção não tratada no backend que força logout (ex.: logout forçado por um filtro de segurança ao detectar erro).

O que anexar ao issue
---------------------
- Captura do Network tab mostrando a requisição `presenca/bulk` e o status code/response.
- Console do browser (mensagens de erro / stacktrace).
- Trechos de logs do backend na hora da tentativa de salvar (formato de request recebido e resposta enviada).
- Passos/usuário afetado e frequência do problema.

Sugestões de investigação / correção
----------------------------------
1. Reproduzir localmente com DevTools Network aberto — verificar request/response e headers (Authorization).
2. Confirmar se o `dataProvider` realmente inclui token JWT/Authorization header para esse endpoint customizado.
3. Verificar o backend para handlers do endpoint `presenca/bulk` e verificação de segurança (Spring Security filters) que possam invalidar sessão.
4. Adicionar logs no backend no início do handler `presenca/bulk` para registrar headers e payload (remova dados sensíveis antes de publicar).
5. Se usar token refresh, validar que o refresh está sendo executado e que a resposta do refresh é usada para atualizar o token no cliente.
6. Tratar respostas 401/403 no frontend com mensagens claras em vez de um logout silencioso.

Exemplo de comando (GitHub CLI) para criar a issue a partir deste arquivo localmente:

```bash
# a partir da raiz do repositório
# (crie o arquivo acima localmente — já o criei em .github/ISSUE_presenca_desloga.md)
# então execute:
gh issue create --title "Bug: Ao salvar presença, o sistema desloga o usuário" --body-file .github/ISSUE_presenca_desloga.md --label bug,backend,high
```

---

Se quiser, eu posso:
- tentar abrir um PR com mudanças no frontend para capturar e exibir o erro ao invés de forçar logout (ex.: adicionar try/catch em `presencaList.jsx` e mostrar notify com erro da resposta);
- ou preparar um passo a passo detalhado para coleta de logs (com os comandos curl/HTTPie) para reproduzir o problema e obter o request/response.

Obrigado — me diga se quer que eu crie o PR de correção para o frontend ou se prefere que eu abra a issue para você (posso gerar o comando gh para você executar).