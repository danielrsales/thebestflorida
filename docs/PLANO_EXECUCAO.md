# TheBestFlorida — Plano de Execução

## 📁 Localização dos Documentos
- Repositório: `~/thebestflorida/docs/`
- Este arquivo: `PLANO_EXECUCAO.md`
- Análise completa: `ANALISE_MELHORIAS.md`

---

## 🔗 Integração TheBestFlorida + DunaHub

### Modelo de Negócio: Leads por Créditos

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   TheBestFlorida    │     │      Lead           │     │      DunaHub        │
│   (Marketplace)     │────▶│   (Cotação)         │────▶│   (CRM + Créditos)  │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
         │                           │                           │
         │                           │                           │
    Consumidor                  Distribuído               Contractor
    busca serviço              para contractors          gerencia leads
                               (desconta créditos)       compra créditos
```

### Fluxo do Lead:

1. **Consumidor** acessa TheBestFlorida
2. **Busca** por "plumber orlando"
3. **Vê** os Top 10 encanadores
4. **Solicita cotação** (formulário)
5. **Lead criado** no sistema
6. **Notificação** enviada para contractors elegíveis
7. **Contractor** aceita o lead (desconta créditos do DunaHub)
8. **Lead aparece** no DunaHub para gestão
9. **Contractor** entra em contato e fecha negócio

### Preços de Créditos (sugestão):

| Tipo de Lead | Créditos | Valor (USD) |
|--------------|----------|-------------|
| Lead básico (só contato) | 5 | $5 |
| Lead qualificado (com projeto) | 15 | $15 |
| Lead exclusivo (só 1 contractor) | 30 | $30 |
| Lead premium (urgente + exclusivo) | 50 | $50 |

### Pacotes de Créditos DunaHub:

| Pacote | Créditos | Preço | Desconto |
|--------|----------|-------|----------|
| Starter | 50 | $40 | 20% |
| Pro | 150 | $100 | 33% |
| Business | 500 | $300 | 40% |

---

## 📅 Mês 1-2: Reviews + Badges + Cadastro Automático

### Semana 1-2: Sistema de Reviews

#### Tabelas no Supabase:
```sql
-- Reviews de clientes
CREATE TABLE tbf_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id UUID REFERENCES tbf_contractors(id),
  
  -- Quem avaliou
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  reviewer_phone TEXT,
  verified BOOLEAN DEFAULT false,
  verification_token TEXT,
  
  -- Avaliação
  rating_overall DECIMAL(2,1) NOT NULL CHECK (rating_overall >= 1 AND rating_overall <= 5),
  rating_quality DECIMAL(2,1),
  rating_punctuality DECIMAL(2,1),
  rating_price DECIMAL(2,1),
  rating_communication DECIMAL(2,1),
  
  -- Conteúdo
  title TEXT,
  content TEXT NOT NULL,
  pros TEXT,
  cons TEXT,
  
  -- Projeto
  service_type TEXT,
  project_cost_range TEXT, -- '$500-1000', '$1000-5000', etc.
  project_date DATE,
  would_recommend BOOLEAN DEFAULT true,
  
  -- Fotos
  photos TEXT[], -- URLs das fotos
  
  -- Resposta do contractor
  contractor_response TEXT,
  contractor_response_at TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  approved_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_reviews_contractor ON tbf_reviews(contractor_id);
CREATE INDEX idx_reviews_status ON tbf_reviews(status);
CREATE INDEX idx_reviews_rating ON tbf_reviews(rating_overall DESC);
```

#### Features:
- [ ] Formulário de review público
- [ ] Verificação por email (token)
- [ ] Upload de fotos do projeto
- [ ] Rating por critérios (qualidade, pontualidade, preço, comunicação)
- [ ] Resposta do contractor
- [ ] Moderação admin
- [ ] Exibição no perfil do contractor
- [ ] Cálculo de média automático

### Semana 3-4: Badges de Confiança

#### Tabelas:
```sql
-- Badges/certificações
CREATE TABLE tbf_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT, -- lucide icon name ou URL
  color TEXT DEFAULT 'blue',
  category TEXT, -- 'verification', 'achievement', 'certification'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badges por contractor
CREATE TABLE tbf_contractor_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id UUID REFERENCES tbf_contractors(id),
  badge_id UUID REFERENCES tbf_badges(id),
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  verification_url TEXT, -- link para documento
  notes TEXT,
  UNIQUE(contractor_id, badge_id)
);

-- Badges iniciais
INSERT INTO tbf_badges (name, slug, description, icon, color, category) VALUES
('Licensed', 'licensed', 'State licensed professional', 'BadgeCheck', 'green', 'verification'),
('Insured', 'insured', 'Liability insurance verified', 'Shield', 'blue', 'verification'),
('Background Checked', 'background-checked', 'Background check passed', 'UserCheck', 'purple', 'verification'),
('Top Rated', 'top-rated', '4.8+ average rating', 'Star', 'yellow', 'achievement'),
('Fast Response', 'fast-response', 'Responds in under 1 hour', 'Zap', 'orange', 'achievement'),
('Best of Florida 2026', 'best-of-florida-2026', 'Selected as top provider', 'Trophy', 'gold', 'achievement'),
('5+ Years', '5-years', '5+ years in business', 'Clock', 'gray', 'verification'),
('100+ Projects', '100-projects', 'Completed 100+ projects', 'Briefcase', 'indigo', 'achievement');
```

#### Features:
- [ ] Exibição de badges no perfil
- [ ] Filtro por badges na busca
- [ ] Admin pode atribuir badges
- [ ] Verificação de documentos
- [ ] Badges automáticos (Top Rated, Fast Response)

---

## 🤖 Cadastro Automático/Inteligente de Contractors

### Estratégia 1: Scraping + Convite

```
1. Scraper busca no Google Maps/Yelp os Top 10 de cada categoria/cidade
2. Extrai: Nome, telefone, email, website, rating, reviews
3. Salva como "leads de contractors" no sistema
4. Envia email/SMS convidando para se cadastrar
5. Link de cadastro pré-preenchido com dados
6. Contractor completa perfil e aceita termos
```

#### Ferramentas:
- Google Places API (oficial, pago)
- Yelp Fusion API (oficial, limitado)
- Scraper custom (Puppeteer/Playwright)

### Estratégia 2: Formulário de Indicação

```
- Página "Indique um profissional"
- Consumidor indica contractor que usou
- Sistema envia convite automático
- Incentivo: "Ganhe $10 em créditos quando ele se cadastrar"
```

### Estratégia 3: Import em Massa

```
- Admin faz upload de CSV com contractors
- Sistema envia convites em lote
- Tracking de quem abriu/clicou/cadastrou
```

### Estratégia 4: Integração com DunaHub

```
- Contractor se cadastra no DunaHub (CRM)
- Opção: "Também quero aparecer no TheBestFlorida"
- Perfil criado automaticamente
- Sincronização de dados
```

---

## 🗄️ Tabela de Contractors Melhorada

```sql
-- Adicionar campos ao tbf_contractors
ALTER TABLE tbf_contractors ADD COLUMN IF NOT EXISTS
  -- Verificações
  license_number TEXT,
  license_state TEXT,
  license_verified BOOLEAN DEFAULT false,
  license_expiry DATE,
  insurance_verified BOOLEAN DEFAULT false,
  insurance_expiry DATE,
  background_check_date DATE,
  background_check_passed BOOLEAN,
  
  -- Estatísticas
  total_reviews INTEGER DEFAULT 0,
  average_rating DECIMAL(2,1) DEFAULT 0,
  response_time_minutes INTEGER, -- tempo médio de resposta
  response_rate DECIMAL(3,2), -- % de leads respondidos
  projects_completed INTEGER DEFAULT 0,
  
  -- DunaHub Integration
  dunahub_org_id TEXT,
  dunahub_user_id TEXT,
  credits_balance INTEGER DEFAULT 0,
  
  -- Status
  featured BOOLEAN DEFAULT false,
  featured_until TIMESTAMPTZ,
  tier TEXT DEFAULT 'free', -- free, pro, premium
  
  -- Onboarding
  onboarding_completed BOOLEAN DEFAULT false,
  invite_sent_at TIMESTAMPTZ,
  invite_token TEXT,
  invited_by TEXT; -- 'scraper', 'referral', 'admin', 'self'
```

---

## 📆 Implementação Semana a Semana

### Semana 1
- [ ] Criar tabelas de reviews e badges no Supabase
- [ ] Formulário de review público
- [ ] Verificação por email

### Semana 2
- [ ] Exibir reviews no perfil do contractor
- [ ] Cálculo de média automático
- [ ] Upload de fotos nos reviews

### Semana 3
- [ ] Sistema de badges
- [ ] Admin pode atribuir badges
- [ ] Exibir badges no perfil

### Semana 4
- [ ] Scraper para buscar contractors (Google Places API)
- [ ] Sistema de convites por email
- [ ] Página de cadastro pré-preenchido

### Semana 5
- [ ] Integração DunaHub ↔ TheBestFlorida
- [ ] Sistema de créditos para leads
- [ ] Notificação de novos leads

### Semana 6
- [ ] Dashboard do contractor
- [ ] Analytics (views, leads, conversão)
- [ ] Compra de créditos via Stripe

---

## 📁 Arquivos a Criar

```
~/thebestflorida/docs/
├── PLANO_EXECUCAO.md (este arquivo)
├── ANALISE_MELHORIAS.md
├── INTEGRACAO_DUNAHUB.md
└── SCRAPER_CONTRACTORS.md

~/thebestflorida/src/
├── app/
│   ├── review/[contractor]/page.tsx  -- Formulário de review
│   ├── contractor/
│   │   ├── register/page.tsx         -- Cadastro de contractor
│   │   └── invite/[token]/page.tsx   -- Convite pré-preenchido
│   └── admin/
│       ├── reviews/page.tsx          -- Moderação de reviews
│       ├── badges/page.tsx           -- Gerenciar badges
│       └── contractors/page.tsx      -- Gerenciar contractors
├── components/
│   ├── reviews/
│   │   ├── ReviewForm.tsx
│   │   ├── ReviewCard.tsx
│   │   └── ReviewList.tsx
│   └── badges/
│       ├── BadgeIcon.tsx
│       └── BadgeList.tsx
└── lib/
    ├── reviews.ts
    ├── badges.ts
    └── contractor-invite.ts
```

---

## ✅ Checklist de Validação

Antes de lançar Mês 1-2:

- [ ] Reviews funcionando e verificados
- [ ] Badges visíveis nos perfis
- [ ] 50+ contractors cadastrados
- [ ] 100+ reviews no sistema
- [ ] Email de convite funcionando
- [ ] Integração básica com DunaHub
- [ ] Admin pode moderar tudo

---

## 🚀 Próximos Passos

1. **Salvar este plano no repositório**
2. **Criar migrations SQL no Supabase**
3. **Implementar formulário de review**
4. **Implementar sistema de badges**
5. **Criar scraper/sistema de convites**
6. **Integrar com DunaHub**
