# Configuração do Microsoft Clarity

## 🚀 Como obter seu código do Clarity

1. **Acesse**: https://clarity.microsoft.com/
2. **Faça login** com sua conta Microsoft (gratuito)
3. **Clique em "Add new project"**
4. **Preencha**:
   - Project name: "Hipertrofia Quiz"
   - Website URL: seu domínio
5. **Copie o código** que aparece (formato: `xxxxxxxxxx`)
6. **Cole no arquivo** `index.html` substituindo `SEU_CODIGO_CLARITY`

## 📊 O que o Clarity vai rastrear

### Métricas Automáticas:

- ✅ **Gravações de sessão**: Veja exatamente como os usuários navegam
- ✅ **Mapas de calor**: Onde os usuários clicam e rolam
- ✅ **Dead clicks**: Cliques em áreas não clicáveis
- ✅ **Rage clicks**: Cliques múltiplos frustrados
- ✅ **Quick backs**: Usuários que voltam rapidamente
- ✅ **JavaScript errors**: Erros que acontecem no site
- ✅ **Tempo na página**: Quanto tempo em cada tela
- ✅ **Taxa de rejeição**: Usuários que saem rapidamente

### Eventos Customizados Implementados:

- 🎯 **quiz_started**: Quando o usuário inicia o quiz
- 🎯 **quiz_step_completed**: Cada resposta do quiz
- 🎯 **quiz_completed**: Quando completa todas as perguntas
- 🎯 **cta_clicked**: Cliques em botões de CTA
- 🎯 **checkout_initiated**: Quando clica para comprar

### Tags Customizadas para Segmentação:

- 📌 **page**: Nome da página atual
- 📌 **quiz_status**: started/completed
- 📌 **quiz_step**: Número da etapa atual
- 📌 **step_X_answer**: Resposta de cada pergunta
- 📌 **conversion_intent**: high (quando vai para checkout)

## 🔍 Como usar no Clarity Dashboard

### 1. Filtrar sessões importantes:

```
- Filtro: quiz_status = completed
  → Ver apenas quem completou o quiz

- Filtro: conversion_intent = high
  → Ver quem clicou no CTA final

- Filtro: quiz_step = 1
  → Ver quem desistiu na primeira pergunta
```

### 2. Criar segmentos:

- **Usuários engajados**: quiz_step >= 3
- **Usuários convertidos**: checkout_initiated event
- **Usuários desistentes**: quiz_step < 3

### 3. Analisar funil:

1. Veja quantos iniciam (quiz_started)
2. Veja onde abandonam (quiz_step)
3. Veja quantos completam (quiz_completed)
4. Veja quantos clicam no CTA (cta_clicked)

## 💡 Insights que você vai conseguir

1. **Onde os usuários abandonam o quiz**

   - Veja em qual pergunta a maioria desiste
   - Assista gravações para entender o motivo

2. **Problemas de UX**

   - Dead clicks mostram confusão
   - Rage clicks mostram frustração
   - Erros JavaScript que atrapalham

3. **Performance do funil**

   - Taxa de conclusão do quiz
   - Taxa de clique no CTA
   - Tempo médio até conversão

4. **Comportamento mobile vs desktop**
   - Compare métricas por dispositivo
   - Identifique problemas específicos

## 🎨 Dicas de Análise

### Priorize sessões com:

- ✅ Rage clicks (usuário frustrado)
- ✅ JavaScript errors
- ✅ Dead clicks (confusão na interface)
- ✅ Quick backs (conteúdo não atraente)

### Perguntas para responder:

- Qual pergunta do quiz tem mais abandono?
- Os usuários rolam até o final da página?
- O botão CTA está visível o suficiente?
- Há erros acontecendo que você não sabe?
- Mobile funciona tão bem quanto desktop?

## 📈 Próximos Passos

Após 24-48 horas com tráfego, você terá:

- Gravações de sessões reais
- Mapas de calor confiáveis
- Insights sobre comportamento
- Dados para otimizar o funil

## 🔐 Privacidade

O Clarity é GDPR compliant e:

- Não coleta PII (informações pessoais) automaticamente
- Mascara campos de senha e cartão
- Você pode configurar máscaras adicionais
- Dados armazenados em servidores Microsoft

## 🆘 Suporte

- Dashboard: https://clarity.microsoft.com/
- Docs: https://docs.microsoft.com/clarity
- Suporte: clarity-support@microsoft.com
