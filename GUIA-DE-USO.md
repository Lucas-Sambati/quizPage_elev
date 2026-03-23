# 🚀 GUIA DE USO - Funil de Conversão Hipertrofia

## 📋 Passo a Passo para Começar

### 1️⃣ Instalar Dependências

Abra o terminal na pasta do projeto e execute:

```bash
pnpm install
```

Se não tiver o pnpm instalado:

```bash
npm install -g pnpm
```

---

### 2️⃣ Executar em Desenvolvimento

```bash
pnpm dev
```

Acesse: `http://localhost:5173`

---

## 🎨 PERSONALIZAÇÕES OBRIGATÓRIAS

### 🔗 URL do Checkout Kiwify

**Arquivo:** `src/pages/SolutionScreen.tsx`

```typescript
// Linha 12 - ALTERE AQUI
const CHECKOUT_URL = "https://pay.kiwify.com.br/SEU_LINK_AQUI";
```

---

### 👤 Seu Nome no Resultado

**Arquivo:** `src/pages/ResultScreen.tsx`

```typescript
// Linha 67 - ALTERE AQUI
<p className="text-sm font-semibold text-foreground">
  — [Seu Nome] {/* ← Coloque seu nome aqui */}
</p>
```

---

### 📸 Adicionar Imagens do Produto

1. Coloque suas imagens na pasta `public/`:

   - `public/planilha-preview.png`
   - `public/pdf-preview.png`

2. Edite `src/pages/SolutionScreen.tsx` (linha 88):

```tsx
{
  /* ANTES - Placeholder */
}
<div className="aspect-[3/4] bg-gradient-to-br...">...</div>;

{
  /* DEPOIS - Imagem real */
}
<img
  src="/planilha-preview.png"
  alt="Planilha de treino"
  className="aspect-[3/4] rounded-lg object-cover"
/>;
```

---

### 🌐 Configurar GitHub Pages

**Arquivo:** `vite.config.ts` (linha 14)

```typescript
// Altere 'hipertrofia' para o nome do SEU repositório
base: process.env.VITE_BASE_PATH || '/seu-repositorio/',
```

---

## 📊 ADICIONAR TRACKING (OPCIONAL MAS RECOMENDADO)

### Meta Pixel

**Arquivo:** `index.html`

Adicione antes do `</head>`:

```html
<!-- Meta Pixel Code -->
<script>
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js"
  );
  fbq("init", "SEU_PIXEL_ID");
  fbq("track", "PageView");
</script>
```

**Arquivo:** `src/lib/analytics.ts`

Descomente as linhas com `fbq`:

```typescript
trackCheckout: () => {
  // Descomente:
  window.fbq?.("track", "InitiateCheckout");
};
```

---

### Google Analytics

**Arquivo:** `index.html`

Adicione antes do `</head>`:

```html
<!-- Google tag (gtag.js) -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXX");
</script>
```

---

## 🚢 DEPLOY NO GITHUB PAGES

### Configuração Inicial (uma vez)

1. Crie um repositório no GitHub
2. Faça o primeiro commit:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

### Deploy

```bash
pnpm run predeploy
pnpm run deploy
```

Aguarde alguns minutos e acesse:
`https://SEU_USUARIO.github.io/SEU_REPO/`

---

## 🎯 FLUXO DO FUNIL

1. **/** - Tela de entrada (hook)
2. **/quiz/1** - Pergunta 1
3. **/quiz/2** - Pergunta 2
4. **/quiz/3** - Pergunta 3
5. **/resultado** - Resultado personalizado
6. **/solucao** - Apresentação + CTA para checkout

---

## ✏️ EDITAR TEXTOS

Todos os textos estão dentro dos componentes das páginas:

- `src/pages/WelcomeScreen.tsx` - Tela de entrada
- `src/pages/QuizScreen.tsx` - Perguntas (linha 11-32)
- `src/pages/ResultScreen.tsx` - Resultado
- `src/pages/SolutionScreen.tsx` - Solução e preço

---

## 🎨 MUDAR CORES

**Arquivo:** `src/index.css`

```css
:root {
  /* Cor principal dos botões - Verde */
  --primary: 142 76% 36%;

  /* Para azul, use: */
  --primary: 217 91% 60%;
}
```

---

## 🔧 COMANDOS ÚTEIS

```bash
# Desenvolvimento
pnpm dev

# Build
pnpm build

# Preview do build
pnpm preview

# Deploy
pnpm run predeploy && pnpm run deploy
```

---

## 📱 TESTAR NO CELULAR

Durante o desenvolvimento:

1. Execute `pnpm dev`
2. Veja o IP exibido (ex: `192.168.1.100:5173`)
3. Acesse do celular na mesma rede WiFi

---

## ❓ TROUBLESHOOTING

### Erro no build?

```bash
rm -rf node_modules
pnpm install
```

### GitHub Pages não atualiza?

- Vá em Settings → Pages
- Verifique se a branch `gh-pages` está selecionada
- Aguarde 2-3 minutos

### Rotas não funcionam no GitHub Pages?

- Verifique se o `base` no `vite.config.ts` está correto
- Verifique se o `404.html` está na pasta `public/`

---

## 📞 PRÓXIMOS PASSOS

✅ Personalize os textos
✅ Adicione suas imagens
✅ Configure URL do Kiwify  
✅ Adicione tracking (Pixel/GA)
✅ Teste no celular
✅ Deploy no GitHub Pages
✅ Direcione tráfego e teste conversão

---

**Dúvidas? Todos os arquivos estão comentados!**
Leia os comentários no código para entender cada parte.
