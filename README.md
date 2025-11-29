<!-- Projeto-Previsao-Clima: README principal em Português -->

# 🌾 Projeto AgroClima — Previsão Agrícola

Uma aplicação full‑stack mínima para fornecer previsões meteorológicas com foco em produtores rurais. O frontend usa Next.js + Tailwind e o backend usa FastAPI consumindo a API Open‑Meteo. O projeto foi preparado para rodar localmente ou em containers via Docker Compose.

---

## 🚀 Como rodar (modo mais simples — Docker)

Recomendado: use Docker e Docker Compose para subir frontend e backend localmente sem dependências de ambiente.

No diretório raiz do repositório rode:

```bash
# build e sobe os containers (recria se necessário)
docker compose up --build -d

# verifique logs (opcional)
docker compose logs -f

# parar e remover
docker compose down
```

Depois de subir, os serviços padrão estarão disponíveis em:
- Frontend: http://localhost:3000
- Backend (API): http://localhost:8000/api — e health: http://localhost:8000/api/health

---

## 🧑‍💻 Executando em desenvolvimento (sem Docker)

Se preferir rodar localmente, siga estes passos em duas janelas/terminais diferentes:

Backend (Python / FastAPI):

```bash
cd backend
python -m venv .venv  # ou crie seu venv preferido
source .venv/bin/activate  # WSL / macOS
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Frontend (Next.js / Tailwind):

```bash
cd frontend
npm ci
# executa tailwind em modo watch + next dev
npm run dev
```

Abra http://localhost:3000 no navegador e configure a cidade para testar a integração com o backend.

---

## 🏗️ Decisões de arquitetura e design adotadas

### Arquitetura
- Separação clara entre frontend e backend (Next.js e FastAPI) — facilita desenvolvimento independente, deploys e escalabilidade.
- Comunicação por REST simples: backend encapsula chamadas à API Open‑Meteo (geocoding + forecast), reduz exposição direta do serviço critico no cliente.
- Containerização via Docker Compose para fácil orquestração local e parity entre dev/prod.

### Frontend
- Next.js (React) para uma base moderna e rotação de página simples.
- TailwindCSS com PostCSS — CSS utilitário e build‑time compilação (tw.css) para garantir paridade entre ambiente dev e produção (evita dependência de CDN em produção).
- Componentização (ex.: `WeatherCard`, `ForecastCarousel`) para manutenção e testes mais fáceis.
- Acessibilidade: controle de foco e navegação por teclado no carrossel.

### Backend
- FastAPI + Uvicorn — microserviço leve com fácil integração e boas práticas de tipagem via pydantic.
- Abstração do provider (Open‑Meteo) por módulos dedicados — facilita trocar fonte de dados ou adicionar caching no futuro.

### UX / UI Decisions
- Modo compacto e detalhado para cards meteorológicos — projetado para clareza para produtores rurais.
- Foco em legibilidade e espaçamento para exibir métricas úteis (max/min/temp/chuva/vento) junto com um conselho agrícola simples.
- Carrossel horizontal (mobile/desktop) para evitar layout instável com cartões de tamanhos variáveis.

---

## ✅ Boas práticas já implementadas
- Build de CSS (PostCSS/Tailwind) durante `npm run build` para garantir estilos em produção
- Docker Compose com health endpoints para depuração local
- Componentes com fallback e heurísticas defensivas (ex.: parsing robusto de campos retornados pela API)

---

## 🔭 Sugestões de melhorias (priorizadas)

1. (Alta) Tests e CI/CD — adicionar pipeline (GitHub Actions / Azure Pipelines) para rodar lint, testes unitários e builds e publicar imagens Docker.
2. (Alta) Caching & rate limiting — cachear respostas do Open‑Meteo e proteger o backend de chamadas excessivas.
3. (Média) Instrumentação & monitoramento — logs estruturados, Sentry/Prometheus para observabilidade em produção.
4. (Média) i18n — internacionalização adequada (pt-BR, en) com mensagens e formatações localizadas.
5. (Baixa) UI variations — super-compact, compact e detalhado toggles for the forecast list so users can choose density.

---

## 📎 Notas e dicas rápidas
- Localhost e portas: o setup padrão usa 3000 (frontend) e 8000 (backend). Se você mudar portas em produção, atualize o arquivo `docker-compose.yml` e a configuração do frontend (ou variável de ambiente).
- O backend já inclui um endpoint de health em `/api/health`.
- Se usar WSL no Windows, garanta que o Docker Desktop está integrado com WSL e use `docker compose` no terminal WSL.

---