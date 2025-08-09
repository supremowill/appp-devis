# App de Mobilidade Urbana (Uber Clone)

Este é um projeto full-stack de um aplicativo de mobilidade urbana, similar ao Uber/99, construído com React, Node.js, Mapbox e PostgreSQL.

## 🚀 Visão Geral

O projeto é um monorepo dividido em:

-   `/frontend`: Aplicação React (Vite) com TypeScript e TailwindCSS para a interface do passageiro e do motorista.
-   `/backend`: API RESTful com Node.js, Express, e Prisma ORM para gerenciar usuários, corridas e comunicação em tempo real.

## ✨ Funcionalidades

-   [x] Cadastro e Login de Passageiros e Motoristas
-   [x] Mapa interativo com Mapbox para visualização e seleção de rotas
-   [x] Solicitação e aceite de corridas (básico)
-   [x] Cálculo de preço baseado na distância (básico)
-   [x] Atualização de status da corrida em tempo real com Socket.io
-   [x] Acompanhamento do motorista no mapa

---

## 🛠️ Tecnologias Utilizadas

-   **Frontend**: React, Vite, TypeScript, TailwindCSS, Mapbox GL JS
-   **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL
-   **Tempo Real**: Socket.io
-   **Autenticação**: JWT + bcrypt
-   **Qualidade**: ESLint, Prettier, Husky
-   **CI/CD**: GitHub Actions
-   **Hospedagem**: Vercel (Frontend), Railway (Backend)

---

## ⚙️ Setup e Instalação

### Pré-requisitos

-   Node.js (v18+)
-   NPM ou Yarn
-   Docker (para rodar o PostgreSQL localmente)
-   Uma conta no [Mapbox](https://www.mapbox.com/) para obter o token de acesso.
-   Uma conta no [Railway](https://railway.app/) para o deploy do backend e banco.
-   Uma conta na [Vercel](https://vercel.com/) para o deploy do frontend.

### 1. Clonar o Repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd <NOME_DO_REPOSITORIO>
```

### 2. Configurar Variáveis de Ambiente

Existem dois arquivos de exemplo `.env.example`, um em `/frontend` e outro em `/backend`. Renomeie-os para `.env` e preencha as variáveis necessárias.

**Backend (`/backend/.env`):**

```ini
# URL de conexão do seu banco de dados PostgreSQL
DATABASE_URL="postgresql://user:password@host:port/database"

# Chave secreta para assinar os tokens JWT
JWT_SECRET="SUA_CHAVE_SECRETA_AQUI"

# Token de acesso do Mapbox (usado no backend para APIs seguras)
MAPBOX_TOKEN="pk.SEU_TOKEN_MAPBOX_AQUI"

# Porta em que o servidor irá rodar
PORT=3001
```

**Frontend (`/frontend/.env`):**

```ini
# Token de acesso do Mapbox (usado no frontend para renderizar o mapa)
VITE_MAPBOX_TOKEN="pk.SEU_TOKEN_MAPBOX_AQUI"

# URL base da sua API backend
VITE_API_BASE_URL="http://localhost:3001"
```

### 3. Instalar Dependências

Execute o comando abaixo na raiz do projeto para instalar as dependências do frontend e do backend.

```bash
npm install --prefix frontend && npm install --prefix backend
```

### 4. Rodar as Migrations do Banco

Com o backend configurado, rode as migrations do Prisma para criar as tabelas no banco de dados.

```bash
npm run prisma:migrate --prefix backend
```

---

## 🚀 Executando Localmente

Você pode rodar os dois ambientes (frontend e backend) simultaneamente.

**Para iniciar o backend (API):**

```bash
npm run dev --prefix backend
# O servidor estará rodando em http://localhost:3001
```

**Para iniciar o frontend (App):**

```bash
npm run dev --prefix frontend
# O app estará disponível em http://localhost:5173
```

---

## 🧪 Scripts Disponíveis

Cada pacote (`frontend` e `backend`) possui seus próprios scripts.

### Backend

-   `npm run dev`: Inicia o servidor em modo de desenvolvimento.
-   `npm run build`: Compila o código TypeScript para JavaScript.
-   `npm run start`: Inicia o servidor em modo de produção (após o build).
-   `npm run lint`: Executa o linter.
-   `npm run test`: Roda os testes.
-   `npm run prisma:generate`: Gera o cliente Prisma.
-   `npm run prisma:migrate`: Aplica as migrations do banco.

### Frontend

-   `npm run dev`: Inicia o servidor de desenvolvimento Vite.
-   `npm run build`: Gera a build de produção.
-   `npm run preview`: Visualiza a build de produção localmente.
-   `npm run lint`: Executa o linter.
-   `npm run test`: Roda os testes.

---

## 🚀 Deploy

### Backend (Railway)

1.  Crie um novo projeto no Railway e conecte seu repositório GitHub.
2.  Adicione um banco de dados PostgreSQL.
3.  Nas configurações do serviço do seu backend, adicione as variáveis de ambiente (`DATABASE_URL`, `JWT_SECRET`, `MAPBOX_TOKEN`, `PORT`). A `DATABASE_URL` será fornecida pelo próprio Railway.
4.  O Railway detectará o `Dockerfile` (se houver) ou o `package.json` e fará o deploy automaticamente.

### Frontend (Vercel)

1.  Crie um novo projeto na Vercel e conecte seu repositório GitHub.
2.  Selecione o diretório `frontend` como a raiz do projeto.
3.  A Vercel detectará que é um projeto Vite e configurará o build automaticamente.
4.  Adicione as variáveis de ambiente:
    -   `VITE_MAPBOX_TOKEN`: seu token público do Mapbox.
    -   `VITE_API_BASE_URL`: a URL pública do seu backend no Railway.
5.  Faça o deploy.
