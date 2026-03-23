# Análise completa do projeto “Hipertrofia” (funil/landing)

Data da análise: **15 de janeiro de 2026**

Este projeto é uma **SPA (Single Page Application)** feita para funcionar como **página de vendas/funil de conversão**.
O usuário chega por um anúncio e percorre um fluxo curto:

1. **Tela de entrada (hook)** →
2. **Quiz (3 perguntas)** →
3. **Resultado (diagnóstico)** →
4. **Solução (oferta + CTA)** → redireciona para **checkout (Kiwify)**.

---

## 1) Stack, build e deploy

### Tecnologias (dependências)

- **React 18** e **ReactDOM**
- **TypeScript**
- **Vite** (build/dev server)
- **Tailwind CSS** (estilos)
- **Wouter** (roteamento leve)
- **lucide-react** (ícones)
- **clsx** + **tailwind-merge** (helper `cn()` para compor classes)

Observação: `next-themes` aparece em `package.json`, porém o tema **não está usando** `next-themes` (há um `ThemeContext` próprio).

### Scripts

- `pnpm dev`: roda em desenvolvimento
- `pnpm build`: `tsc && vite build`
- `pnpm preview`: preview do build
- `pnpm run predeploy`: build + copia `public/404.html` para `dist/404.html`
- `pnpm run deploy`: deploy com `gh-pages -d dist`

### Configuração para GitHub Pages

- `vite.config.ts` usa `base: process.env.VITE_BASE_PATH || '/hipertrofia/'`
- Há um sistema de **fallback de rota**:
  - `public/404.html` salva `sessionStorage.redirect = location.href` e faz meta-refresh para `'/hipertrofia/'`.
  - `src/main.tsx` lê esse `sessionStorage.redirect` e reescreve a URL via `history.replaceState` para restaurar o caminho correto da SPA.

---

## 2) Meta tags e identidade

### HTML base (`index.html`)

- `lang="pt-BR"`
- `title`: **“Diagnóstico Gratuito - Hipertrofia”**
- `meta description`: **“Descubra em 60 segundos o que está travando seus resultados na academia”**

---

## 3) Rotas e fluxo (Wouter)

Rotas definidas em `src/App.tsx`:

- `/` → **WelcomeScreen** (entrada/hook)
- `/quiz/:step` → **QuizScreen** (etapas 1..3)
- `/resultado` → **ResultScreen** (diagnóstico)
- `/solucao` → **SolutionScreen** (oferta + checkout)
- rota fallback → redireciona para `/`

### Base path no roteamento

Existe um hook de navegação customizado (`useCustomLocation`) que:

- Remove o `BASE_URL` do Vite do `window.location.pathname`.
- Faz `pushState` sempre prefixando o base path do GitHub Pages.
- Dispara evento `pushstate` para forçar re-render.

---

## 4) Estado do Quiz (contexto)

O estado é mantido em memória (não persiste em localStorage).

Estrutura do estado (`src/hooks/useQuiz.tsx`):

- `answers.timeTraining?: string`
- `answers.mainProblem?: string`
- `answers.trainingDays?: string`

A cada clique numa opção do quiz:

- salva no contexto (`setAnswer`)
- envia evento de analytics (hoje é `console.log`)
- avança automaticamente para a próxima rota

---

## 5) Tema (claro/escuro)

O tema é controlado por `src/contexts/ThemeContext.tsx`.

- Temas: `light | dark | system`.
- Aplica classe `light` ou `dark` no `<html>`.
- Persiste seleção em `localStorage` (chave padrão: `vite-ui-theme`).

Observação: o app inicializa com `defaultTheme="light"` em `src/App.tsx`.

---

## 6) Tracking / Analytics (instrumentação)

Arquivo: `src/lib/analytics.ts`

Hoje, os eventos apenas fazem `console.log` com prefixo **📊** e há comentários prontos para:

- `gtag` (Google Analytics)
- `fbq` (Meta Pixel)

Eventos existentes:

- `trackPageView(pageName)`
- `trackEvent(eventName, params?)`
- `trackQuizStart()`
- `trackQuizStep(step, answer)`
- `trackQuizComplete()`
- `trackCTAClick(location)`
- `trackCheckout()`

Onde são disparados:

- Welcome: `trackPageView('welcome')`, `trackQuizStart()`, `trackCTAClick('welcome_screen')`
- Quiz: `trackPageView('quiz_step_X')`, `trackQuizStep(step, answer)`, `trackQuizComplete()`
- Result: `trackPageView('result')`, `trackCTAClick('result_screen')`
- Solution: `trackPageView('solution')`, `trackCheckout()`, `trackCTAClick('solution_screen_checkout')`

---

## 7) Componentes e comportamento visual

### 7.1) `ScreenContainer`

Arquivo: `src/components/ui/ScreenContainer.tsx`

- Envolve todas as telas.
- `fullHeight`:
  - `true`: `min-h-screen h-screen` e `max-w-2xl h-full`
  - `false`: `min-h-screen` e `max-w-2xl px-4 py-6`

### 7.2) `CTAButton` (botão principal)

Arquivo: `src/components/ui/CTAButton.tsx`
Comportamentos:

- Efeito de clique: `active:scale-95`.
- Transição: `transition-all duration-200`.
- Foco acessível: `focus-visible:ring-2 ...`.
- Variantes:
  - `primary`: verde (cor principal) + sombra/hover
  - `secondary`
  - `outline`
- Tamanhos:
  - `default`: `h-12 px-6 text-base min-w-[200px]`
  - `lg`: `h-14 px-8 text-lg min-w-[240px]`

### 7.3) `QuizOption` (opções do quiz)

Arquivo: `src/components/ui/QuizOption.tsx`
Comportamentos:

- Ao clicar, chama `onClick()` e remove o foco (`e.currentTarget.blur()`), evitando “hover preso” no mobile.
- Estilo:
  - Card com blur (`backdrop-blur-sm`) e borda
  - Mobile: `active:border-primary active:bg-primary/10 active:scale-[0.98]`
  - Desktop: hover com borda/ fundo/ sombra
  - Barra verde fina à esquerda aparece em `active` (mobile) e `hover` (desktop)
  - Seta de continuação **só aparece no desktop** (opacidade 0 → 100 no hover)

### 7.4) `ProgressBar`

Arquivo: `src/components/ProgressBar.tsx`

- Barra cinza com “fill” verde.
- Animação de width: `transition-all duration-500 ease-out`.

### 7.5) `ErrorBoundary`

Arquivo: `src/components/ErrorBoundary.tsx`
Se ocorrer erro em runtime, a UI exibida é:

- Emoji: **⚠️**
- Título: **“Algo deu errado”**
- Texto: **“Desculpe, encontramos um erro inesperado. Por favor, recarregue a página.”**
- Botão: **“Recarregar página”**

Em `development`, mostra detalhes do erro em um `<details>`.

---

## 8) Animações e efeitos

### 8.1) Keyframes customizados (Tailwind utilities)

Arquivo: `src/index.css`

- `@keyframes shimmer` + classe `.animate-shimmer`:

  - Faz um brilho “varrendo” horizontalmente.
  - Usado na barra de progresso da tela de loading.

- `@keyframes float` + classe `.animate-float`:
  - Partículas sobem (translateY até -100vh), com variação leve no X e fade in/out.
  - Usado como partículas decorativas na tela de loading.

### 8.2) Animações Tailwind “prontas” usadas no app

- `animate-pulse` (background do loading e círculo)
- `animate-ping` (círculo pulsante grande)
- `animate-bounce` (ícone central)
- `animate-spin` (ícone SVG girando, com `animationDuration: 3s` inline)

### 8.3) Transições

- Em botões e opções: `transition-all` com durations entre 200ms e 300ms.
- Na barra de progresso do quiz: 500ms.

---

## 9) Telas (páginas) — texto e layout como aparecem

Abaixo está o **texto renderizado** em cada tela, na ordem visual (topo → meio → rodapé), incluindo emojis e labels.

### 9.1) Tela 1 — Entrada / Hook (`/`)

Arquivo: `src/pages/WelcomeScreen.tsx`

Elementos:

- Fundo: gradiente suave vertical.
- Badge de credibilidade (topo):
  - Ícone “check” (SVG)
  - Texto: **“Método aprovado por +10.000 alunos”**

Conteúdo central:

- Ícone (círculo com raio):
- Headline:
  - **“Descubra em 60 segundos o que está travando seus resultados na academia”**
  - A parte **“60 segundos”** aparece em destaque (cor primária).
- Subheadline:
  - **“Responda 3 perguntas rápidas e veja exatamente o que ajustar no seu treino.”**
- Lista de benefícios (cada linha):
  - **“✓ Diagnóstico personalizado”**
  - **“✓ Resultados imediatos”**
  - **“✓ 100% gratuito”**

CTA (rodapé):

- Botão grande:
  - **“🚀 Começar diagnóstico gratuito”**
- Textos de confiança:
  - **“⏱️ Leva menos de 1 minuto”**
  - **“🔒 Não precisa de cadastro”**

Ação do CTA:

- Vai para `/quiz/1`.

---

### 9.2) Tela 2 — Quiz (1 a 3) (`/quiz/:step`)

Arquivo: `src/pages/QuizScreen.tsx`

Topo:

- Label: **“📋 Diagnóstico”**
- Indicador: **“Etapa X de 3”**
- Barra de progresso:
  - step 1: 33.33%
  - step 2: 66.66%
  - step 3: 100%

Perguntas e alternativas (texto exato):

#### Etapa 1

- Ícone: **⏱️**
- Pergunta: **“Há quanto tempo você treina?”**
- Opções:
  - **“Menos de 6 meses”**
  - **“Entre 6 meses e 2 anos”**
  - **“Mais de 2 anos e estou estagnado”**
- Rodapé (hint): **“👆 Escolha uma opção para continuar”**

#### Etapa 2

- Ícone: **🎯**
- Pergunta: **“O que mais te incomoda hoje no treino?”**
- Opções:
  - **“Não consigo aumentar carga”**
  - **“Treino muito e evoluo pouco”**
  - **“Não sei se meu treino faz sentido”**
  - **“Resultados travaram faz meses”**
- Rodapé (hint): **“👆 Escolha uma opção para continuar”**

#### Etapa 3

- Ícone: **📅**
- Pergunta: **“Quantos dias por semana você treina?”**
- Opções:
  - **“3x ou menos”**
  - **“4x por semana”**
  - **“5x ou mais”**
- Rodapé (hint): **“👆 Última pergunta!”**

Comportamento:

- Ao clicar em uma opção:
  - salva resposta
  - avança automaticamente para a próxima etapa
  - na etapa 3, abre uma tela intermediária de “análise” antes do resultado

---

### 9.3) Tela intermediária — “IA Analisando” (aparece após terminar o quiz)

Arquivo: `src/components/LoadingAnalysis.tsx`

Duração/comportamento:

- Dura **~2 segundos** e depois navega para `/resultado`.
- Progresso vai de 0 a 100 em incrementos de 2 a cada 30ms (~1.5s).
- Mensagens alternam a cada 600ms (loop).

Texto exibido:

- Título: **“🤖 IA Analisando...”**
- Mensagens (uma por vez):
  - **“Analisando suas respostas...”**
  - **“Identificando seu perfil...”**
  - **“Preparando seu diagnóstico personalizado...”**
- Percentual visível: **“X%”**

Animações visuais:

- Background com `animate-pulse`.
- Círculo grande com `animate-ping`.
- Círculo médio com `animate-pulse`.
- Ícone central “bola” com `animate-bounce`.
- SVG dentro do ícone com `animate-spin` (3s).
- Barra de progresso com `animate-shimmer`.
- Partículas decorativas com `animate-float`.
  - Observação: posições (`left/top`) são geradas com `Math.random()` em render — podem mudar entre renders.

---

### 9.4) Tela 3 — Resultado (diagnóstico) (`/resultado`)

Arquivo: `src/pages/ResultScreen.tsx`

Topo:

- Badge:
  - Texto: **“Diagnóstico completo”**

O resultado é **personalizado** por “perfil”, definido pelas respostas:

- `trainingDays` (pergunta 3)
- `mainProblem` (pergunta 2)

Regras (como o código decide):

- Considera “alta frequência” se:
  - `4x por semana` **ou** `5x ou mais`
- PERFIL TREINA DEMAIS:
  - alta frequência **e** `Treino muito e evoluo pouco`
- PERFIL ESTAGNADO:
  - alta frequência **e** `Não consigo aumentar carga`
- Caso contrário:
  - PERFIL SEM DIREÇÃO

#### Perfil 1: TREINA DEMAIS

- Título (em caixa alta): **“PERFIL O TREINA MUITO\"”**
- Headline:
  - **“Seu principal erro hoje não é esforço — é o volume de treino muito alto”**
  - (a parte “é o volume de treino muito alto” aparece em destaque)
- Bloco 1:
  - **“A maioria das pessoas treina com disciplina, comparece na academia, se esforça... mas acaba exagerando no volume de treino.”**
- Bloco 2:
  - **“Não é preguiça. Não é genética. É falta de método.”**
- Depoimento:
  - **“\"Isso foi exatamente o que me travou por muito tempo. Quando entendi que o volume precisa ser controlado, tudo mudou.\"”**
  - Autor: **“— Lucas M.”**

#### Perfil 2: ESTAGNADO

- Título: **“PERFIL O ESTAGNADO”**
- Headline (observação importante):
  - Também aparece como **“Seu principal erro hoje não é esforço — é o volume de treino muito alto”**
- Bloco 1:
  - **“A maioria das pessoas treina com disciplina, se esforça... mas acaba exagerando no volume de treino, e ele é o vilão contra a progressão de carga.”**
- Bloco 2:
  - **“Não é preguiça. Não é genética. É falta de método.”**
- Depoimento:
  - **“\"Era exatamente isso que estava me impedindo de aumentar as cargas. Quando entendi que o volume precisa ser controlado, tudo mudou.\"”**
  - Autor: **“— Rafael S.”**

#### Perfil 3: SEM DIREÇÃO

- Título: **“PERFIL O SEM DIREÇÃO”**
- Headline:
  - **“Seu principal erro hoje não é esforço — é a falta de direcionamento”**
- Bloco 1:
  - **“A maioria das pessoas treina com disciplina, se esforça... mas só faz aquilo que o instrutor manda, ou segue um treino genérico do intagram.”**
- Bloco 2:
  - **“Não é preguiça. Não é genética. É falta de método.”**
- Depoimento:
  - **“\"Eu seguia a ficha que o instrutor me passava, não fazia ideia que o problema estava ali. Quando entendi que precisava de um treino com embasamento científico, tudo mudou.\"”**
  - Autor: **“— Bruno A.”**

CTA (fim):

- Botão: **“✨ Ver a solução”**
- Texto abaixo: **“Preparamos algo especial para você”**

Ação do CTA:

- Vai para `/solucao`.

---

### 9.5) Tela 4 — Solução + Oferta + Checkout (`/solucao`)

Arquivo: `src/pages/SolutionScreen.tsx`

IMPORTANTE:

- Checkout está como placeholder:
  - `const CHECKOUT_URL = 'https://pay.kiwify.com.br/SEU_LINK_AQUI'`
- Ao clicar no CTA final:
  - `window.location.href = CHECKOUT_URL`

Topo:

- Badge:
  - **“🎁 Oferta especial”**

Conteúdo por perfil (mesma regra do resultado):

#### Perfil 1: TREINA DEMAIS

- Headline: **“Eu passei anos treinando demais até descobrir o segredo”**
- Sub: **“Não é treinar mais — é treinar com o volume certo”**
- Texto de conexão:
  - **“Se você treina muito mas evolui pouco, o problema não é falta de esforço. É excesso de volume sem controle. Foi exatamente isso que me travou, e foi isso que esse método resolveu.”**
- Highlight de benefício:
  - **“Aprenda a dosar o volume para crescer sem se queimar”**

#### Perfil 2: ESTAGNADO

- Headline: **“Eu também ficava meses sem aumentar a carga”**
- Sub: **“Até descobrir que o problema era o volume excessivo”**
- Texto de conexão:
  - **“Se sua força não aumenta mesmo treinando pesado, o problema não é genética. É o volume de treino sabotando sua progressão. Quando ajustei isso, minhas cargas explodiram.”**
- Highlight de benefício:
  - **“Sistema de progressão que te faz aumentar carga toda semana”**

#### Perfil 3: SEM DIREÇÃO

- Headline: **“Você não precisa de mais treino, precisa do treino certo”**
- Sub: **“Seguir qualquer ficha não vai te levar a lugar nenhum”**
- Texto de conexão:
  - **“Se você não sabe se seu treino faz sentido, é porque ele provavelmente não faz. Treino sem embasamento científico é loteria. Vou te mostrar exatamente o que fazer.”**
- Highlight de benefício:
  - **“Método cientificamente comprovado que funciona de verdade”**

Lista “o que recebe” (sempre igual):

- Linha de introdução (em destaque):
  - **“✨ {benefitHighlight}:”**
- Itens (com ícone CheckCircle2):
  - **“Planilha de treino editável com progressão automática”**
  - **“PDF explicando o método passo a passo (50+ páginas)”**
  - **“Exemplo real de uso e aplicação”**
  - **“Acesso imediato por e-mail”**

Seção “Veja o que você vai receber”:

- Texto: **“👀 Veja o que você vai receber:”**
- Dois cards placeholder (hover muda borda):
  - Card 1:
    - Emoji: **📊**
    - Texto:
      - **“Planilha”**
      - **“Editável”**
  - Card 2:
    - Emoji: **📖**
    - Texto:
      - **“PDF Completo”**
      - **“50+ páginas”**
- Nota em itálico:
  - **“Substitua por imagens reais do produto em /public/”**

Preço e CTA:

- Texto: **“🎯 Acesso completo por apenas”**
- Preço grande:
  - **“R$ 19,90”**
- Texto: **“pagamento único • sem mensalidades”**
- Badge:
  - **“Acesso imediato após o pagamento”**

CTA principal:

- Botão grande: **“🚀 Quero acessar agora”**
- Badges/linha de confiança:
  - **“Checkout seguro”**
  - **“Receba por e-mail”**
  - **“Acesso imediato”**

Botão “voltar”:

- Texto: **“← Voltar”**
- Ação: volta para `/resultado`.

---

## 10) Observações importantes (consistência e personalização)

### Ajustes “obrigatórios” antes de rodar tráfego

- Trocar `CHECKOUT_URL` em `src/pages/SolutionScreen.tsx`.
- Substituir placeholders de “Planilha/PDF” por imagens reais em `public/`.

### Observações de texto/copy (do jeito que o código está hoje)

- Em `ResultScreen`, o título do perfil TREINA DEMAIS contém um caractere extra:
  - **`PERFIL O TREINA MUITO"`** (há uma aspa no final).
- Em `ResultScreen`, o perfil ESTAGNADO reutiliza o mesmo highlight de “volume muito alto”, o que pode ser intencional ou um erro de copy (mas está assim no código).
- Em `ResultScreen`, “intagram” está escrito assim (sem correção automática).

### Persistência

- Respostas do quiz ficam apenas em memória. Se recarregar a página no meio do funil, o resultado pode ficar vazio/inesperado.

---

## 11) Arquivos de apoio do projeto

- `README.md`: visão geral do funil, tecnologias e deploy.
- `GUIA-DE-USO.md`: guia de personalização (checkout, imagens, base path, tracking).
- `CHECKLIST.md`: checklist antes do deploy.

---

## 12) Mapa do funil (resumo rápido)

- `/` → headline + CTA “Começar diagnóstico gratuito”
- `/quiz/1` → pergunta 1
- `/quiz/2` → pergunta 2
- `/quiz/3` → pergunta 3
- Loading IA (~2s) → “IA Analisando...” + shimmer + partículas
- `/resultado` → diagnóstico por perfil + CTA “Ver a solução”
- `/solucao` → oferta + preço R$ 19,90 + CTA “Quero acessar agora” → checkout Kiwify
