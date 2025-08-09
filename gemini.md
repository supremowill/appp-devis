🎯 Missão do Agente
Você é um agente de desenvolvimento sênior. Sua missão é criar e manter um app de mobilidade urbana (tipo Uber/99) com Mapbox (não usar Google Maps). Entregue frontend + backend completos, com autenticação, solicitação/aceite de corridas, mapa/rotas, tempo/distância, tempo real com Socket.io, banco PostgreSQL/Prisma, pronto para publicar no GitHub e deploy (Vercel/Railway).

Sempre salve decisões técnicas, endpoints, modelos de dados e pendências neste arquivo (seção “Registro de Progresso”), para não se perder.

🧱 Stack e Decisões Fixas
Frontend: React (Vite) + TypeScript + TailwindCSS

Mapas/Rotas: Mapbox GL JS + Mapbox Directions API + Mapbox Geocoding (NUNCA Google)

Backend: Node.js + Express + TypeScript

Tempo real: Socket.io

Banco: PostgreSQL + Prisma ORM

Auth: JWT + bcrypt

Hospedagem: Frontend (Vercel), Backend (Railway)

Testes: Vitest (frontend), Jest (backend)

Qualidade: ESLint + Prettier + Husky + lint-staged

CI: GitHub Actions (build + lint + testes)

Commits: Conventional Commits

.env: Manter exemplos em /frontend/.env.example e /backend/.env.example

🗂 Estrutura do Repositório
bash
Copiar
.
├─ gemini.md                      # ESTE arquivo: instruções do agente + progresso
├─ README.md                      # Visão geral do projeto e como rodar
├─ .gitignore
├─ .github/
│  └─ workflows/ci.yml            # CI: build/lint/test
├─ frontend/
│  ├─ index.html
│  ├─ vite.config.ts
│  ├─ package.json
│  ├─ .env.example
│  └─ src/
│     ├─ main.tsx
│     ├─ App.tsx
│     ├─ pages/
│     │  ├─ PassengerDashboard.tsx
│     │  ├─ DriverDashboard.tsx
│     │  └─ Auth.tsx
│     ├─ components/
│     │  ├─ Map.tsx
│     │  ├─ RideForm.tsx
│     │  └─ DriverList.tsx
│     ├─ lib/mapbox.ts            # inicialização e helpers do Mapbox
│     └─ styles/index.css
└─ backend/
   ├─ package.json
   ├─ tsconfig.json
   ├─ .env.example
   ├─ prisma/
   │  ├─ schema.prisma
   │  └─ migrations/              # gerado via prisma migrate
   └─ src/
      ├─ app.ts                   # Express app
      ├─ server.ts                # bootstrap (porta, sockets)
      ├─ config/env.ts
      ├─ config/mapbox.ts
      ├─ modules/
      │  ├─ auth/
      │  │  ├─ auth.controller.ts
      │  │  ├─ auth.routes.ts
      │  │  └─ auth.service.ts
      │  ├─ rides/
      │  │  ├─ rides.controller.ts
      │  │  ├─ rides.routes.ts
      │  │  └─ rides.service.ts
      │  └─ users/
      │     ├─ users.controller.ts
      │     ├─ users.routes.ts
      │     └─ users.service.ts
      ├─ sockets/
      │  └─ rides.socket.ts
      └─ middlewares/
         ├─ auth.middleware.ts
         └─ error.middleware.ts
🔐 Variáveis de Ambiente
/frontend/.env.example
ini
Copiar
VITE_MAPBOX_TOKEN=pk.SEU_TOKEN_MAPBOX_AQUI
VITE_API_BASE_URL=http://localhost:3001
/backend/.env.example
ini
Copiar
DATABASE_URL=postgresql://user:password@localhost:5432/mobapp
JWT_SECRET=trocar_por_um_segredo_seguro
MAPBOX_TOKEN=pk.SEIU_TOKEN_MAPBOX
PORT=3001
Nunca comitar .env reais. Somente .env.example.

🗺️ Uso do Mapbox (Regra de Ouro)
Sempre usar Mapbox GL JS para renderização.

Rotas com Directions API.

Busca/Autocomplete com Geocoding API.

Restringir o token por domínio quando for produção.

Não usar Google Maps.

Helper recomendado (frontend/src/lib/mapbox.ts):

initMap(containerId, center, zoom)

addMarker(map, coords, options)

drawRoute(map, geojsonRoute)

getDirections(origin, destination) (chamando backend para assinar/proxy, se necessário)

🧬 Modelo de Dados (Prisma)
backend/prisma/schema.prisma

prisma
Copiar
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
generator client {
  provider = "prisma-client-js"
}

enum Role {
  DRIVER
  PASSENGER
}

enum RideStatus {
  REQUESTED
  ACCEPTED
  EN_ROUTE_TO_PASSENGER
  EN_ROUTE_TO_DESTINATION
  COMPLETED
  CANCELED
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  phone     String?
  password  String
  role      Role
  carModel  String?  // para DRIVER
  carPlate  String?  // para DRIVER
  cnh       String?  // para DRIVER
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ridesAsPassenger Ride[] @relation("PassengerRides")
  ridesAsDriver    Ride[] @relation("DriverRides")
}

model Ride {
  id           String     @id @default(cuid())
  passenger    User       @relation("PassengerRides", fields: [passengerId], references: [id])
  passengerId  String
  driver       User?      @relation("DriverRides", fields: [driverId], references: [id])
  driverId     String?
  status       RideStatus @default(REQUESTED)
  originLat    Float
  originLng    Float
  destLat      Float
  destLng      Float
  distanceKm   Float?
  durationMin  Float?
  price        Float?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
}
🌐 Endpoints (Backend)
Base URL: ${PORT || 3001}

POST /auth/register {name,email,password,role,phone?,carModel?,carPlate?,cnh?}

POST /auth/login {email,password} → {token,user}

GET /users/me (JWT)

POST /rides (JWT passenger) → cria corrida {origin,destination}

POST /rides/:id/accept (JWT driver)

POST /rides/:id/status (JWT driver) {status}

GET /rides/:id

GET /rides/my (filtra por role)

POST /map/directions {origin:{lng,lat}, destination:{lng,lat}} → proxy Mapbox Directions

POST /map/geocode {query} → proxy Geocoding

Sempre validar roles (passageiro/motorista). Proteger rotas com middleware JWT.

📡 Socket.io (Tempo Real)
Namespace: /rides

Eventos:

driver:location {rideId, driverId, lng, lat, heading?}

ride:update {rideId, status}

ride:accepted {rideId, driver}

Salvar última posição do motorista em cache (em memória inicialmente; Redis futuramente).

🖥️ Telas / Fluxo (Frontend)
Auth: login/registro (passageiro, motorista)

PassengerDashboard:

Mapa centralizado no usuário

Form origem/destino (geocoding/autocomplete)

Botão “Solicitar Corrida”

Visualizar motorista no mapa + status

DriverDashboard:

Alternar disponibilidade

Lista de solicitações

Aceitar corrida

Ver rota até passageiro e depois destino

Componentes:

Map.tsx (Mapbox)

RideForm.tsx (origem/destino)

DriverList.tsx

StatusBadge.tsx

🧪 Tarefas Prioritárias (Agente)
 Criar monorepo com frontend/ e backend/ e arquivos-base (README, .gitignore, ci.yml).

 Iniciar frontend (Vite + TS + Tailwind) e backend (Express + TS).

 Configurar ESLint/Prettier/Husky/lint-staged nos dois pacotes.

 Criar Prisma schema, prisma migrate dev, e seed básico.

 Implementar Auth (register/login/JWT/middlewares).

 Implementar endpoints /map/* (proxy Directions/Geocode).

 Criar Map.tsx com Mapbox GL JS e helpers; ler VITE_MAPBOX_TOKEN.

 Implementar solicitação de corrida (frontend/backend).

 Implementar Socket.io (posições/status).

 Criar README.md com instruções de setup e .env.example.

 Configurar CI (GitHub Actions): build, lint, test.

 Preparar deploy (Vercel frontend / Railway backend).

 Atualizar “Registro de Progresso” abaixo a cada avanço.

🧭 Como o Agente Deve Agir
Sempre registrar decisões e pendências em “Registro de Progresso”.

Nunca usar Google Maps; sempre Mapbox.

Não inventar credenciais. Se faltar algo, criar placeholder e anotar aqui o que o William precisa fornecer.

Commits pequenos e descritivos (Conventional Commits).

Criar scripts NPM claros para dev/build/test/lint.

Entregar código que roda após npm install + setar .env.

Deixar PRONTO para GitHub: .gitignore, README, CI, pasta organizada.

🧰 Scripts Recomendados
Frontend package.json
json
Copiar
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest"
  }
}
Backend package.json
json
Copiar
{
  "scripts": {
    "dev": "ts-node-dev --respawn src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "lint": "eslint .",
    "test": "jest",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}
🧪 Qualidade e CI
.github/workflows/ci.yml (resumo)
Rodar em pushes e PRs para main e develop

Passos: npm ci → lint → test → build em frontend/ e backend/

🧾 .gitignore (raiz)
bash
Copiar
node_modules/
dist/
coverage/
.env
.env.*
frontend/node_modules/
backend/node_modules/
frontend/dist/
backend/dist/
🚀 Deploy (resumo)
Frontend (Vercel):

VITE_API_BASE_URL apontando para Railway.

VITE_MAPBOX_TOKEN configurado.

Backend (Railway):

DATABASE_URL, JWT_SECRET, MAPBOX_TOKEN, PORT

Habilitar porta pública, healthcheck GET /health

📌 Dicas Mapbox no Frontend
Exemplo de inicialização (TypeScript):

ts
Copiar
import mapboxgl from 'mapbox-gl';

export function initMap(containerId: string, center: [number, number], zoom = 13) {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;
  const map = new mapboxgl.Map({
    container: containerId,
    style: 'mapbox://styles/mapbox/streets-v12',
    center,
    zoom
  });
  map.addControl(new mapboxgl.NavigationControl());
  return map;
}
📝 Registro de Progresso (o agente deve atualizar)
[YYYY-MM-DD] Repositório criado; monorepo com frontend/ e backend/; CI inicial configurada.

[YYYY-MM-DD] Frontend bootstrapped (Vite + TS + Tailwind); Mapbox funcionando com token.

[YYYY-MM-DD] Backend bootstrapped (Express + TS); Prisma conectado; migrations OK.

[YYYY-MM-DD] Auth implementado; rotas de rides criadas; sockets básicos funcionando.

[YYYY-MM-DD] Proxy /map/directions e /map/geocode online; integração no frontend.

[YYYY-MM-DD] README e .env.example atualizados; projeto roda localmente.

[YYYY-MM-DD] Deploy Vercel/Railway realizado; links adicionados ao README.

✅ Checklist Final Antes do Commit Inicial
 frontend roda com npm run dev (Vite) e carrega Mapbox.

 backend roda com npm run dev, conecta ao Postgres e expõe /health.

 .env.example completos nos dois pacotes.

 README explica setup, env, scripts e deploy.

 CI verde no GitHub.

 Nenhuma chave secreta real comitada.

🔄 Comandos Úteis (para você, agente)
Criar projeto Vite: npm create vite@latest frontend -- --template react-ts

Tailwind: npm i -D tailwindcss postcss autoprefixer && npx tailwindcss init -p

Backend TS: npm i express cors zod jsonwebtoken bcrypt socket.io + npm i -D typescript ts-node-dev @types/*

Prisma: npm i -D prisma && npm i @prisma/client && npx prisma init

Nota final: Qualquer dúvida de credencial (tokens, database URL) — crie placeholders, explique no README, e documente na seção “Registro de Progresso”. Não trave o desenvolvimento