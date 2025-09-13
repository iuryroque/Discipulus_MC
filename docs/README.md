# Documentação - Projeto Discipulus_V1

Esta pasta contém toda a documentação técnica do projeto, organizada por categoria.

## 📋 Índice da Documentação

### 🏗️ Infraestrutura
- **[README_INFRA.md](./README_INFRA.md)** - Visão geral completa da infraestrutura do projeto
  - Arquitetura do sistema
  - Tecnologias utilizadas
  - Configuração e execução
  - Estrutura de diretórios

### 🔧 Jenkins CI/CD
- **[JENKINS_SETUP.md](./JENKINS_SETUP.md)** - Configuração completa do Jenkins
  - Pré-requisitos e plugins
  - Configuração de credenciais
  - Setup do job e pipeline
  - Otimização e troubleshooting

- **[JENKINS_NODE_SETUP.md](./JENKINS_NODE_SETUP.md)** - Configuração do nó Jenkins
  - Scripts de instalação automática
  - Configuração de dependências
  - Testes e verificação
  - Monitoramento e manutenção

### 🐳 Containers e Build
- **[BUILD_CONTAINERS.md](./BUILD_CONTAINERS.md)** - Builds com containers dedicados
  - Dockerfiles de build
  - Scripts auxiliares
  - Uso local e no Jenkins
  - Vantagens e troubleshooting

## 🚀 Como Usar Esta Documentação

### Para Desenvolvedores
1. **Comece com** `README_INFRA.md` para entender a arquitetura
2. **Configure o ambiente** seguindo os guias específicos
3. **Use os scripts** fornecidos para automação

### Para DevOps/SRE
1. **Configure Jenkins** com `JENKINS_SETUP.md`
2. **Configure os nós** com `JENKINS_NODE_SETUP.md`
3. **Implemente containers** com `BUILD_CONTAINERS.md`

### Para Iniciantes
1. **Leia primeiro** `README_INFRA.md` (visão geral)
2. **Escolha sua abordagem** (Jenkins ou build local)
3. **Siga os guias** passo a passo

## 📁 Organização

```
docs/
├── README.md                 # Este arquivo (índice)
├── README_INFRA.md          # Documentação da infraestrutura
├── JENKINS_SETUP.md         # Setup do Jenkins
├── JENKINS_NODE_SETUP.md    # Setup do nó Jenkins
└── BUILD_CONTAINERS.md      # Builds com containers
```

## 🔄 Manutenção da Documentação

- **Atualize** os documentos sempre que houver mudanças na infraestrutura
- **Teste** os scripts e comandos antes de documentar
- **Mantenha** consistência entre os documentos
- **Use** emojis e formatação para facilitar a leitura

## 🆘 Suporte

Se encontrar problemas ou tiver dúvidas:
1. **Consulte** a seção de troubleshooting nos respectivos documentos
2. **Verifique** os logs do Jenkins/Docker
3. **Teste** localmente antes de implementar em produção

---

💡 **Dica**: Mantenha esta documentação sempre atualizada e acessível para toda a equipe!