# SEV — Sistema de Evidência de Validação (Frontend)

## 📋 Requisitos do Sistema

### 1\. **Node.js** (versão 18 ou superior)

* Download: https://nodejs.org/
* Verificar instalação: `node --version`

### 2\. **npm** (já vem junto com o Node.js)

* Verificar instalação: `npm --version`

### 3\. **Backend Django rodando**

Este frontend consome uma API Django (projeto separado). Ela precisa estar no ar em
`http://localhost:8000/` antes de logar no sistema — veja o `.env.example` do
backend e o repositório correspondente para subir o Postgres + Django.

\---

## 🚀 Instalação e Execução

Todo o projeto vive dentro da pasta `client/`. Não existe mais nenhuma estrutura
na raiz (isso foi limpo — veja a seção "Histórico" no fim deste arquivo).

### Passo 1: Entrar na pasta do projeto

```bash
cd client
```

### Passo 2: Instalar dependências

```bash
npm install
```

### Passo 3: Executar em desenvolvimento

```bash
npm run dev
```

O servidor de desenvolvimento inicia em:

* **Local**: http://localhost:3000/

### Passo 4: Build para produção (opcional)

```bash
npm run build
```

Gera os arquivos estáticos em `client/dist/`. Como o servidor Express de
produção foi removido junto com a limpeza (nunca chegou a ser usado), o
deploy desses arquivos estáticos deve ser resolvido antes de ir para
produção — pode ser um Nginx, o próprio `whitenoise`/Django servindo os
estáticos, ou um servidor Node simples, dependendo de como a infra final for
decidida.

\---

## 🔐 Login

O login é feito contra o backend Django (endpoint `/api/auth/token/`, JWT).
Não existem credenciais "mágicas" por palavra-chave no e-mail — é preciso ter
um usuário real cadastrado no Django, com um dos papéis:

* **TESTADOR** — executa validações usando chaves de acesso
* **AUDITOR** — cria validações, cadastra itens, gera chaves de acesso
* **ADMIN** — acesso total (gestão de usuários, logs, configurações)

Para criar o primeiro usuário administrador, use o Django normalmente:

```bash
python manage.py createsuperuser
```

\---

## 📁 Estrutura do Projeto

```
projeto\_SEV---frontend-master/
└── client/                          # Todo o projeto frontend vive aqui
    ├── public/                      # Arquivos estáticos
    ├── src/
    │   ├── components/              # Componentes React reutilizáveis
    │   │   ├── ui/                  # Componentes shadcn/ui (só os usados de fato)
    │   │   ├── Header.tsx
    │   │   ├── AuditLogsModal.tsx
    │   │   └── ErrorBoundary.tsx
    │   ├── pages/                   # Uma tela por arquivo (fluxo de validação)
    │   ├── contexts/
    │   │   └── AuthContext.tsx      # Autenticação (JWT via Django)
    │   ├── services/
    │   │   ├── api.ts               # Cliente axios (baseURL do backend)
    │   │   └── auth.ts
    │   ├── App.tsx                  # Roteamento manual por estado (telas)
    │   ├── main.tsx                 # Entry point
    │   └── styles/globals.css
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    └── tsconfig.json
```

\---

## 🎯 Fluxo de Uso

### Para Auditores/Administradores:

1. Fazer login
2. Clicar em "Criar Validação" e preencher dados básicos (nome, tipo, divisão, setores)
3. Cadastrar os itens a serem validados (manualmente ou importando uma planilha Excel)
4. Finalizar e gerar as chaves de acesso (uma por setor)
5. Compartilhar cada chave com o testador responsável por aquele setor

### Para Testadores:

1. Fazer login
2. Inserir a chave de acesso recebida
3. Executar a validação: preencher status de cada item e anexar evidência
4. Adicionar comentários se necessário
5. Finalizar a validação

\---

## 🛠️ Comandos Disponíveis (rodar sempre dentro de `client/`)

```bash
npm run dev       # Iniciar dev server com HMR
npm run build     # Compilar para produção
npm run preview   # Preview local da build de produção
npm run check     # Verificar tipos TypeScript (tsc --noEmit)
npm run format    # Formatar código com Prettier
```

\---

## 🐛 Troubleshooting

### Erro: "Module not found" / dependências bugadas

```bash
rm -rf node\_modules package-lock.json
npm install
```

### Erro: "Port 3000 already in use"

```bash
npm run dev -- --port 3001
```

### Tela de login não avança / erro de rede

Confirme que o backend Django está rodando em `http://localhost:8000/` — o
endereço da API está fixo em `client/src/services/api.ts`.

\---

## 

