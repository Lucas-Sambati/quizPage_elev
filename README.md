# Hipertrofia - Funil de Conversão

Projeto React + TypeScript + Vite de funil interativo para diagnóstico e venda de planilha de treino.

## 🚀 Tecnologias

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Wouter** - Roteamento leve
- **shadcn/ui** - Componentes UI
- **next-themes** - Theme provider com dark mode
- **pnpm** - Gerenciador de pacotes

## 📦 Instalação

```bash
# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Preview do build
pnpm preview
```

## 🚢 Deploy no GitHub Pages

1. Configure o nome do repositório no `vite.config.ts`:

```ts
base: '/seu-repositorio/',
```

2. Execute o deploy:

```bash
pnpm run predeploy
pnpm run deploy
```

## 📁 Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
│   ├── ui/          # Componentes shadcn/ui
│   └── ...
├── pages/           # Páginas da aplicação
├── contexts/        # Context API (ThemeContext)
├── hooks/           # Hooks customizados
├── lib/             # Utilitários
└── main.tsx
```

## 🎯 Fluxo do Funil

1. **Tela 1** - Hook de entrada
2. **Tela 2** - Quiz interativo (3 perguntas)
3. **Tela 3** - Resultado personalizado
4. **Tela 4** - Apresentação da solução + CTA

## 📝 Personalização

### URL do Checkout

Edite em `src/pages/SolutionScreen.tsx`:

```ts
const CHECKOUT_URL = "SUA_URL_KIWIFY_AQUI";
```

### Textos e Perguntas

Todos os textos estão centralizados nos componentes de cada tela para fácil edição.

### Imagens

Coloque suas imagens em `public/` e atualize os imports nos componentes.

## 📊 Tracking

Prepare para adicionar:

- Meta Pixel
- Google Analytics
- Eventos de conversão

Locais estratégicos já comentados no código.

## 🎨 Cores e Tema

Tema configurado em `src/index.css` com variáveis CSS.
Para alterar as cores principais, edite as variáveis CSS.

## 📱 Mobile-First

Todo o design é otimizado para mobile, com breakpoints responsivos via Tailwind.
