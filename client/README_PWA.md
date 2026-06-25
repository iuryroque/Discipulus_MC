# PWA (Progressive Web App) - Discipulus

Este documento descreve a implementação de PWA no projeto Discipulus utilizando React Admin e Vite.

## O que é PWA?

PWA (Progressive Web App) é uma aplicação web que oferece uma experiência semelhante a um aplicativo nativo, incluindo:

- 📱 **Instalação**: Pode ser instalado no dispositivo do usuário
- 🔌 **Funcionalidade Offline**: Funciona mesmo sem conexão com a internet
- 🚀 **Desempenho**: Carregamento rápido através de cache inteligente
- 🔔 **Notificações**: Suporte a notificações push (futuro)
- 📲 **Experiência Nativa**: Interface similar a aplicativos nativos

## Recursos Implementados

### 1. Service Worker

O service worker foi configurado com o plugin `vite-plugin-pwa` e inclui:

- **Auto-atualização**: Detecta automaticamente novas versões
- **Cache inteligente**: Estratégias de cache para diferentes tipos de recursos
- **Modo offline**: Permite uso básico da aplicação sem conexão

### 2. Manifest Web App

O arquivo `manifest.webmanifest` foi gerado automaticamente com:

- Nome da aplicação: "Discipulus - Sistema de Gestão de Discipulado"
- Nome curto: "Discipulus"
- Tema de cor: #1976d2 (azul Material-UI)
- Ícones em múltiplos tamanhos

### 3. Ícones PWA

Foram gerados os seguintes ícones:

- `icon-192x192.png`: Ícone padrão pequeno
- `icon-512x512.png`: Ícone padrão grande
- `maskable-icon-192x192.png`: Ícone adaptável pequeno
- `maskable-icon-512x512.png`: Ícone adaptável grande
- `apple-touch-icon.png`: Ícone para dispositivos iOS (180x180)

### 4. Estratégias de Cache

#### Google Fonts
- **Estratégia**: CacheFirst
- **Duração**: 1 ano
- **Motivo**: Recursos de fonte raramente mudam

#### API
- **Estratégia**: NetworkFirst
- **Duração**: 5 minutos
- **Motivo**: Prioriza dados frescos, mas tem fallback para cache

#### Assets Estáticos
- **Estratégia**: Precache
- **Recursos**: JS, CSS, HTML, imagens, fontes

## Como Usar

### Instalação no Dispositivo

#### Desktop (Chrome/Edge)
1. Acesse a aplicação no navegador
2. Observe o ícone de instalação na barra de endereços (⊕)
3. Clique em "Instalar Discipulus"
4. A aplicação será adicionada ao seu sistema como um app nativo

#### Mobile (Android)
1. Acesse a aplicação no navegador Chrome
2. Toque no menu (⋮) > "Adicionar à tela inicial"
3. Confirme a instalação
4. O ícone aparecerá na sua tela inicial

#### Mobile (iOS/Safari)
1. Acesse a aplicação no Safari
2. Toque no botão de compartilhar (􀈂)
3. Role para baixo e toque em "Adicionar à Tela de Início"
4. Confirme a instalação

### Modo Offline

A aplicação armazenará em cache:
- Todos os arquivos estáticos (JS, CSS, HTML)
- Respostas recentes da API (5 minutos)
- Fontes do Google

**Limitações offline**:
- Operações que requerem autenticação podem falhar
- Dados não serão sincronizados até que a conexão seja restaurada
- Algumas funcionalidades podem ter comportamento reduzido

### Atualizações

Quando uma nova versão estiver disponível:

1. Uma mensagem será exibida: "Nova versão disponível! Deseja atualizar?"
2. Clique em "OK" para atualizar
3. A aplicação será recarregada com a nova versão

Você também pode recarregar manualmente a página para forçar uma atualização.

## Desenvolvimento

### Configuração

A configuração do PWA está em `vite.config.js`:

```javascript
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.png', 'apple-touch-icon.png'],
  manifest: { /* configuração do manifest */ },
  workbox: { /* estratégias de cache */ },
  devOptions: {
    enabled: true, // PWA habilitado em desenvolvimento
    type: 'module'
  }
})
```

### Testando em Desenvolvimento

O PWA está habilitado mesmo em modo de desenvolvimento:

```bash
npm run dev
```

Acesse `http://localhost:3000` e abra as DevTools:
- **Application tab** > **Service Workers**: Veja o service worker ativo
- **Application tab** > **Manifest**: Veja as configurações do manifest
- **Application tab** > **Cache Storage**: Veja os recursos em cache

### Build para Produção

```bash
npm run build
```

Arquivos gerados:
- `dist/sw.js`: Service worker
- `dist/workbox-*.js`: Runtime do Workbox
- `dist/manifest.webmanifest`: Manifest da aplicação

### Preview da Build

```bash
npm run preview
```

Isso iniciará um servidor local servindo a build de produção, permitindo testar o PWA em condições reais.

## Integração com React Admin

O PWA foi configurado para funcionar perfeitamente com React Admin:

- ✅ Rotas do React Admin são cacheadas corretamente
- ✅ Autenticação funciona offline (token em localStorage)
- ✅ DataProvider usa NetworkFirst para dados frescos
- ✅ Tema Material-UI aplicado ao manifest
- ✅ Layout responsivo mantido no modo instalado

## Troubleshooting

### Service Worker não registra

**Problema**: Service worker não aparece nas DevTools

**Solução**:
1. Certifique-se de que está acessando via HTTPS ou localhost
2. Limpe o cache do navegador
3. Verifique o console por erros
4. Recarregue a página com Ctrl+Shift+R (hard refresh)

### Cache não atualiza

**Problema**: Mudanças no código não aparecem

**Solução**:
1. Abra DevTools > Application > Service Workers
2. Marque "Update on reload"
3. Clique em "Unregister" e recarregue
4. Faça um novo build (`npm run build`)

### Ícones não aparecem

**Problema**: Ícones do PWA não são exibidos

**Solução**:
1. Verifique se os arquivos de ícone existem em `public/`
2. Confirme que o build foi executado (`npm run build`)
3. Verifique o manifest em DevTools > Application > Manifest

### Aplicação não instala

**Problema**: Opção de instalação não aparece

**Solução**:
1. Certifique-se de que está em HTTPS
2. Verifique se o manifest é válido (DevTools > Application > Manifest)
3. Confirme que o service worker está ativo
4. Alguns navegadores exigem interação do usuário antes de mostrar o prompt

## Recursos Adicionais

- [Documentação Vite PWA](https://vite-pwa-org.netlify.app/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)
- [React Admin Documentation](https://marmelab.com/react-admin/)

## Próximos Passos

Funcionalidades futuras planejadas:

- [ ] Notificações Push
- [ ] Sincronização em Background
- [ ] Compartilhamento nativo
- [ ] Atalhos de aplicativo
- [ ] Detecção de rede e sincronização inteligente
- [ ] Estratégia de cache mais sofisticada por recurso

## Autor

Este recurso PWA foi implementado para o projeto Discipulus, um sistema de gestão de discipulado desenvolvido com React Admin.
