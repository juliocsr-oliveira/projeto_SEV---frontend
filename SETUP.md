# SEV — Sistema de Evidência de Validação

## 📋 Requisitos do Sistema

Antes de instalar o projeto, certifique-se de que possui os seguintes softwares instalados na sua máquina:

### 1. **Node.js** (versão 18 ou superior)
- Download: https://nodejs.org/
- Verificar instalação: `node --version`

### 2. **pnpm** (gerenciador de pacotes)
- Instalação global: `npm install -g pnpm`
- Verificar instalação: `pnpm --version`
- **Versão recomendada**: 10.4.1 ou superior

### 3. **Git** (opcional, para controle de versão)
- Download: https://git-scm.com/
- Verificar instalação: `git --version`

---

## 🚀 Instalação e Execução

### Passo 1: Extrair o projeto
```bash
unzip sev-system.zip
cd sev-system
```

### Passo 2: Instalar dependências
```bash
pnpm install
```

Este comando irá instalar todas as dependências listadas no `package.json`, incluindo:

#### Dependências Principais:
- **React 19.2.1** - Framework UI
- **React DOM 19.2.1** - Renderização DOM
- **Tailwind CSS 4.1.14** - Framework CSS utilitário
- **Vite 7.1.7** - Build tool e dev server
- **TypeScript 5.6.3** - Linguagem tipada
- **Wouter 3.3.5** - Roteamento client-side
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones
- **Framer Motion** - Animações
- **React Hook Form** - Gestão de formulários
- **Axios** - Cliente HTTP
- **Express 4.21.2** - Servidor backend (produção)

#### Dependências de Desenvolvimento:
- **Vite** - Dev server com HMR (Hot Module Replacement)
- **ESBuild** - Bundler de produção
- **Prettier** - Formatação de código
- **TypeScript** - Verificação de tipos

### Passo 3: Executar em desenvolvimento
```bash
pnpm dev
```

O servidor de desenvolvimento será iniciado em:
- **Local**: http://localhost:3000/
- **Network**: http://{seu-ip}:3000/

### Passo 4: Build para produção (opcional)
```bash
pnpm build
```

Isto irá gerar:
- `/dist/public/` - Arquivos estáticos do frontend
- `/dist/index.js` - Servidor backend compilado

### Passo 5: Executar em produção (opcional)
```bash
pnpm start
```

---

## 🔐 Credenciais de Teste

Use as seguintes credenciais para testar o sistema:

### Testador
- **Email**: qualquer email com "testador" (ex: testador@example.com)
- **Senha**: password123
- **Função**: Executar validações usando chaves de acesso

### Auditor
- **Email**: qualquer email com "auditor" (ex: auditor@example.com)
- **Senha**: password123
- **Função**: Criar validações, gerar chaves, confirmar testes

### Administrador
- **Email**: qualquer email com "admin" (ex: admin@example.com)
- **Senha**: password123
- **Função**: Acesso total (gestão de utilizadores, logs, configurações)

---

## 📁 Estrutura do Projeto

```
sev-system/
├── client/                          # Frontend React
│   ├── public/                      # Arquivos estáticos
│   ├── src/
│   │   ├── components/              # Componentes React reutilizáveis
│   │   │   ├── ui/                  # Componentes shadcn/ui
│   │   │   ├── Header.tsx           # Cabeçalho corporativo
│   │   │   ├── CreateValidation.tsx # Criação de validação
│   │   │   ├── SystemSelection.tsx  # Seleção de sistema
│   │   │   ├── EditValidationFields.tsx # Edição de campos
│   │   │   └── ...
│   │   ├── pages/                   # Páginas da aplicação
│   │   │   ├── Login.tsx            # Página de login
│   │   │   ├── Home.tsx             # Dashboard
│   │   │   ├── Validations.tsx      # Histórico de validações
│   │   │   └── ...
│   │   ├── contexts/                # React Context
│   │   │   └── AuthContext.tsx      # Contexto de autenticação
│   │   ├── utils/                   # Funções utilitárias
│   │   ├── App.tsx                  # Componente raiz
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Estilos globais
│   └── index.html                   # HTML principal
├── server/
│   └── index.ts                     # Servidor Express (produção)
├── shared/
│   └── const.ts                     # Constantes compartilhadas
├── package.json                     # Dependências do projeto
├── pnpm-lock.yaml                   # Lock file do pnpm
├── tsconfig.json                    # Configuração TypeScript
├── vite.config.ts                   # Configuração Vite
└── components.json                  # Configuração shadcn/ui
```

---

## 🎯 Fluxo de Uso

### Para Auditores/Administradores:
1. Fazer login com credenciais de auditor/admin
2. Clicar em "Criar Validação"
3. Preencher dados básicos (nome, descrição, tipo, divisão, responsável)
4. Selecionar sistema, ambiente e subsistema
5. **Editar campos de validação** (NOVO: adicionar/remover/editar campos)
6. Finalizar e gerar chave de acesso
7. Compartilhar chave com testadores

### Para Testadores:
1. Fazer login com credenciais de testador
2. Inserir chave de acesso fornecida pelo auditor
3. Executar validação preenchendo campos e fazendo upload de evidências
4. Adicionar comentários se necessário
5. Finalizar validação

---

## 🛠️ Comandos Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Iniciar dev server com HMR

# Build
pnpm build            # Compilar para produção

# Produção
pnpm start            # Executar servidor em produção

# Verificação
pnpm check            # Verificar tipos TypeScript
pnpm format           # Formatar código com Prettier

# Preview
pnpm preview          # Preview da build de produção
```

---

## 🐛 Troubleshooting

### Erro: "pnpm: command not found"
```bash
npm install -g pnpm
```

### Erro: "Port 3000 already in use"
```bash
# Mudar porta no vite.config.ts ou usar:
pnpm dev -- --port 3001
```

### Erro: "Module not found"
```bash
# Limpar cache e reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Erro: TypeScript errors
```bash
# Verificar tipos
pnpm check

# Recompilar
pnpm build
```

---

## 📞 Suporte

Para questões ou problemas, consulte a documentação do projeto ou entre em contacto com o desenvolvedor.

---

## 📄 Licença

MIT

---

**Versão**: 1.0.0  
**Última atualização**: Fevereiro 2026
