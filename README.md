# App de Mobilidade Urbana (Uber Clone)

Este é um projeto full-stack de um aplicativo de mobilidade urbana, similar ao Uber/99, construído com React, Node.js, Mapbox e PostgreSQL.

## 🚀 Visão Geral

O projeto é um monorepo dividido em:

-   `/frontend`: Aplicação React PWA (Vite) com TypeScript e TailwindCSS para a interface do passageiro.
-   `/backend`: API RESTful com Node.js, Express, e Prisma ORM para gerenciar usuários, corridas e comunicação em tempo real.

## ✨ Funcionalidades do Frontend

-   [x] **PWA (Progressive Web App)** - Instalável e funciona offline
-   [x] **Mobile-First Design** - Otimizado para dispositivos móveis (375-430px)
-   [x] **Tela Splash/Home** - Mapa de fundo com pin de táxi e CTA
-   [x] **Buscar Corrida** - Inputs From/To com autocomplete e mapa interativo
-   [x] **Estimativa de Preço** - Cálculo automático baseado na rota
-   [x] **Avaliar Motorista** - Sistema de avaliação com estrelas e comentários
-   [x] **Tema Azul/Amarelo** - Design baseado no mock fornecido
-   [x] **Integração com Backend** - Consumo de APIs REST
-   [x] **Mapbox Integration** - Mapas interativos e geocoding

## 🛠️ Tecnologias Utilizadas

### Frontend
-   **React 19** + **Vite** + **TypeScript**
-   **TailwindCSS** - Estilização utilitária
-   **React Router** - Roteamento SPA
-   **Zustand** - Gerenciamento de estado
-   **Mapbox GL JS** - Mapas interativos
-   **Vite PWA Plugin** - Funcionalidades PWA
-   **Lucide React** - Ícones

### Backend (Existente)
-   **Node.js** + **Express** + **TypeScript**
-   **Prisma ORM** + **PostgreSQL**
-   **Socket.io** - Tempo real
-   **JWT** + **bcrypt** - Autenticação

---

## ⚙️ Setup e Instalação

### Pré-requisitos

-   Node.js (v18+)
-   NPM ou Yarn
-   Uma conta no [Mapbox](https://www.mapbox.com/) para obter o token de acesso
-   Backend rodando (veja instruções na seção backend)

### 1. Clonar o Repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd <NOME_DO_REPOSITORIO>
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` no diretório `/frontend`:

```bash
cd frontend
cp .env.example .env
```

**Frontend (`/frontend/.env`):**

```ini
# URL base da sua API backend
VITE_API_URL=http://localhost:3001

# Token de acesso do Mapbox (usado no frontend para renderizar o mapa)
VITE_MAPBOX_TOKEN=pk.SEU_TOKEN_MAPBOX_AQUI
```

### 3. Instalar Dependências

```bash
cd frontend
npm install
```

### 4. Executar o Frontend

```bash
npm run dev
# O app estará disponível em http://localhost:5173
```

---

## 🚀 Scripts Disponíveis

### Frontend

-   `npm run dev`: Inicia o servidor de desenvolvimento Vite
-   `npm run build`: Gera a build de produção
-   `npm run preview`: Visualiza a build de produção localmente
-   `npm run lint`: Executa o linter

---

## 📱 Funcionalidades PWA

O frontend é uma Progressive Web App (PWA) completa com:

-   **Instalável**: Pode ser instalada como app nativo
-   **Offline**: Cache básico para funcionar sem internet
-   **Manifest**: Configuração completa para instalação
-   **Service Worker**: Gerenciamento automático de cache
-   **Ícones**: Ícones 192x192 e 512x512 para diferentes dispositivos

---

## 🎨 Design System

### Paleta de Cores
-   **Primária**: `#0A4AA6` (Azul principal)
-   **Secundária**: `#FFD200` (Amarelo CTA)
-   **Azul Médio**: `#0E64D2`
-   **Fundo Claro**: `#E6F0F8`
-   **Texto Primário**: `#0A2342`
-   **Texto Secundário**: `#6B7280`

### Tipografia
-   **Fonte**: Inter (Google Fonts)
-   **Pesos**: 400, 500, 600, 700

### Componentes
-   **Botões**: Bordas arredondadas (rounded-2xl), estados hover/active
-   **Inputs**: Foco com ring azul, placeholders claros
-   **Cards**: Sombras suaves, cantos arredondados
-   **Mapas**: Integração completa com Mapbox GL JS

---

## 🔌 Integração com Backend

O frontend consome as seguintes APIs do backend:

### Endpoints Utilizados

-   `POST /map/geocode` - Busca de endereços
-   `POST /map/route` - Cálculo de rotas
-   `POST /rides/estimate` - Estimativa de preço
-   `POST /rides` - Criação de corridas
-   `GET /drivers/:id` - Dados do motorista
-   `POST /drivers/:id/rate` - Avaliação do motorista

### Adaptadores

Todos os endpoints são consumidos através de adaptadores em `/src/api/`, permitindo fácil manutenção e modificação dos contratos.

---

## 📱 Telas

### 1. Splash/Home (`/`)
-   Mapa de fundo com pin de táxi animado
-   Botão "Buscar Corrida"
-   Footer com dots e "DEVELOPED BY"

### 2. Buscar Corrida (`/ride`)
-   Inputs "From" e "To" com autocomplete
-   Mapa interativo com marcadores
-   Chips A/B/C para locais sugeridos
-   Estimativa de distância, tempo e preço
-   Botão "PICK ME"

### 3. Avaliar Motorista (`/rate`)
-   Card azul com avatar do motorista
-   Sistema de 5 estrelas interativo
-   Campo de comentário opcional
-   Botão "RATE DRIVER"

---

## 🧪 Testes e Desenvolvimento

### Testando Localmente

1. **Geocoding**: Digite "Avenida Brasil, Maringá" no campo From/To
2. **Rota**: Selecione origem e destino para ver a rota no mapa
3. **Estimativa**: Preço calculado automaticamente
4. **Avaliação**: Teste com dados mock do motorista

### Fallbacks

-   **Mapbox indisponível**: Mostra mapa placeholder
-   **API offline**: Exibe mensagens de erro apropriadas
-   **Dados mock**: Driver demo para testes de avaliação

---

## 🚀 Deploy

### Frontend (Vercel)

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente:
   -   `VITE_API_URL`: URL do seu backend em produção
   -   `VITE_MAPBOX_TOKEN`: Token público do Mapbox
3. Deploy automático a cada push

### PWA

A build de produção gera automaticamente:
-   Service Worker para cache
-   Manifest.json para instalação
-   Ícones otimizados

---

## 🔧 Estrutura do Projeto

```
frontend/
├── public/
│   ├── manifest.webmanifest
│   └── icons/
├── src/
│   ├── api/              # Adaptadores para backend
│   ├── components/       # Componentes reutilizáveis
│   ├── pages/           # Páginas da aplicação
│   ├── store/           # Gerenciamento de estado (Zustand)
│   ├── lib/             # Utilitários (Mapbox)
│   ├── types/           # Tipos TypeScript
│   ├── utils/           # Funções utilitárias
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── .env.example
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

---

## 📝 Notas Importantes

-   **Backend Intacto**: O frontend apenas consome APIs, sem modificar o backend
-   **Adaptadores**: Se os endpoints retornarem dados diferentes, os adaptadores mapeiam automaticamente
-   **Mobile-First**: Otimizado para 375-430px, mas responsivo até desktop
-   **Acessibilidade**: Labels, ARIA, contraste adequado
-   **Performance**: Lazy loading, debounced geocoding, cache PWA

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.