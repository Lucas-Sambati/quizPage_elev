# Contexto

- Este é um app mobile profissional para praticantes de musculação e fitness. Ele tem suporte nativo, web e pwa.

## Marca/Identidade:

### Nome do aplicativo: ELEV

### Identidade:

- Fundo principal: #000000
- Texto primário: #FFFFFF
- Ação / destaque / Cor da marca: #3c0c8f
- Sucesso: #22C55E

## O ELEV tem:

### Controle de Treinos

- Pagina Treinos
- Layout moderno e adaptado de uma planilha do Excel
- Capturamos a evolução do usuário em cargas e repetições

### Sessão explicativa

- Pagina Conteúdo
- Módulos que levam para uma tela com explicações mais detalhadas, porém dinâmicas
- Diversidade de temas e temas exclusivos para assinatura Elev Elite

### Comunidade

- Pagina home
- Ranking da comunidade por pontos semanais
- Atividade da comunidade
- Acesso do perfil de outros usuários

### Integração com IA

- Pagina Consultoria
- Envio de todas as métricas do usuário + foto do físico (opcional e a partir da assinatura Elev Progress) + mensagem com preferências (opcional e a partir da assinatura Elev Progress) para o ChatGpt
- Retorna como resultado: feedback + plano de treino + plano alimentar
- Cada assinatura tem sua quantidade de análises que o usuário pode fazer por semana: Elev Start 1, Elev Progress 3 e Elev Elite 5

### Perfil do Usuário

- Pagina perfil,
- Informações sobre o usuário e sua conta
- Possibilidade de edição
- Ganhos da gamificação

### Gamificação

- Todo o app funciona com sistema de pontuação/level

## Padrões de segurança já implementados e para sempre seguir em novas implementações de acordo com o contexto dessa nova implementação:

### Autenticação & Autorização (Broken Access Control / IDOR)

- Usar a procedure tRPC correta (protectedProcedure, subscribedProcedure, eliteProcedure, featureGatedProcedure, adminProcedure) — nunca usar publicProcedure para ações que requerem login ou assinatura
- Chamar assertOwnership() em toda rota que recebe userId ou opera sobre recurso de um usuário — o userId da sessão (ctx.user.id) é a fonte de verdade, nunca confiar em userId vindo do input sem validar ownership
- Tokens JWT: access token com vida curta (15min), refresh token com rotação por família — se detectar reuso de refresh token, invalidar toda a família
- Armazenar access token apenas em memória (web) ou SecureStore (nativo) — nunca em localStorage ou AsyncStorage
- Refresh token via cookie httpOnly + Secure + SameSite=Strict (web) — nunca acessível via JavaScript
- Proteger contra enumeração de usuários — rotas de forgot-password e register devem retornar mensagens genéricas independente de o email existir ou não

### Validação de Input (Injection / Mass Assignment)

- Validar input com Zod — toda rota precisa de .input(z.object({...})) com UUIDs .uuid(), strings .min()/.max(), números com ranges, enums explícitos
- SQL Injection: usar exclusivamente Drizzle ORM com queries parametrizadas — nunca interpolar variáveis em SQL. Se precisar de query raw, usar sql\`...${param}\` do Drizzle (parameterizado)
- Whitelist de campos em updates (Mass Assignment) — nunca permitir alteração de role, points, level, xp ou campos sensíveis via input do frontend. Definir explicitamente quais campos podem ser atualizados
- Normalizar emails com .trim().toLowerCase() em toda entrada de email, tanto frontend quanto backend
- Normalizar usernames com .trim().toLowerCase() — manter consistência e evitar duplicatas por case sensitivity
- Validar no frontend também — mesmas regras de formato (email regex, senha forte, ranges numéricos) para UX imediata, mas nunca confiar apenas na validação do frontend
- Verificar unicidade antes de updates — ao atualizar campos com unique constraint (ex: username), verificar unicidade via query antes de salvar e retornar erro amigável (TRPCError CONFLICT), não deixar estourar a constraint do banco

### XSS (Cross-Site Scripting)

- Nunca usar dangerouslySetInnerHTML ou equivalentes — todo conteúdo dinâmico deve ser renderizado via componentes React que fazem escape automático
- Se precisar renderizar HTML externo (ex: conteúdo de IA), usar um sanitizador como DOMPurify antes
- CSP (Content-Security-Policy) está configurado via Helmet em produção — novas origens externas devem ser adicionadas à whitelist do Helmet, nunca usar 'unsafe-inline' ou 'unsafe-eval'

### Lógica de Negócio & Integridade de Dados

- Calcular valores sensíveis server-side (XP, pontos, conquistas, limites de uso — nunca confiar no valor do cliente). Exemplo: XP de módulo vem de MODULE_XP_REWARDS no servidor, não do input
- Usar transações para operações atômicas — transação com FOR UPDATE lock quando houver check-then-act (ex: verificar quota → consumir consulta). Exemplo: recordConsultationUsage() já usa FOR UPDATE
- Idempotência — verificar se a operação já foi realizada antes de executar (ex: checar se já existe xpTransaction para aquela sessão antes de dar XP)
- Prevenir double-spend — checar completedAt/processedAt antes de conceder recompensas
- Unique constraints no schema — prevenir duplicatas onde necessário (ex: user+recurso). Criar constraints compostas quando a combinação precisa ser única

### Upload de Arquivos

- Validar magic bytes — se aceitar arquivo, validar bytes reais do conteúdo + MIME whitelist (apenas image/jpeg, image/png, image/webp) + tamanho máximo
- Para uploads base64 (ex: foto de perfil), extrair o buffer da string base64 e validar os primeiros bytes (FF D8 FF para JPEG, 89 50 4E 47 para PNG, RIFF...WEBP para WebP) — não confiar apenas no prefixo data:image/
- Validar tamanho máximo do corpo da requisição (body-parser limit já configurado)
- Per-user rate limit em rotas de upload — limitar por userId (ex: 3 uploads/min)

### Exposição de Dados & Privacidade

- Não expor dados sensíveis — nunca retornar passwordHash, tokens, refreshTokenFamily ou dados internos em responses. Usar sanitizeUser() ou select whitelist
- Erros genéricos ao cliente — mensagens como "Erro ao processar", sem detalhes internos, stack traces ou nomes de tabelas. Em produção, nunca enviar error.stack
- Respeitar perfis privados — se a feature expõe dados de outro usuário, verificar isPublicProfile. Ocultar campos sensíveis (ex: instagramUsername) para perfis privados
- Dados de busca (searchUsers, ranking) devem usar select whitelist — retornar apenas campos necessários para exibição

### Rate Limiting & DoS

- Rate limiting global já configurado (300 req/15min) — manter Helmet + express-rate-limit em produção
- Rate limiting específico em endpoints sensíveis — se a rota envolve recurso custoso (IA/OpenAI, email, upload), adicionar rate limit dedicado
- Endpoints de autenticação com rate limit próprio (15 req/15min por IP) — aplicar a login, register, forgot-password, verify-reset-code e reset-password
- Limitar tamanho de payloads — body-parser com limit configurado

### Webhooks & Integrações Externas

- Webhook: usar crypto.timingSafeEqual() para verificar secrets — nunca comparar tokens com === (vulnerável a timing attack)
- Verificar staleEvents — ignorar eventos de webhook para produtos antigos/inválidos
- Validar upgrades — manter mapa de VALID_UPGRADES para impedir que webhooks façam downgrade
- Usar secrets separados para webhooks diferentes (ex: main vs upgrade)
- SSRF: nunca fazer fetch/request para URLs vindas do input do usuário sem validação rigorosa de domínio/IP

### Segurança de Senha & Criptografia

- Hash de senhas com bcrypt (salt rounds 12+) — nunca armazenar senhas em texto puro
- Códigos de reset temporários com expiração curta — invalidar após uso
- JWT assinado com HS256 + secret forte — rotacionar JWT_SECRET periodicamente em produção

### Logs & Monitoramento

- Logs sem dados sensíveis — logar eventos com userId/email mas nunca senhas, tokens, hashes ou dados de pagamento
- Em produção, logar tentativas de acesso negado e eventos suspeitos (reuso de refresh token, webhook inválido)

### Frontend — Gates & Navegação

- Novas telas públicas (que não exigem login) devem ser adicionadas à whitelist do AuthGate (PUBLIC_ROUTES)
- Novas telas que não exigem assinatura devem ser adicionadas à whitelist do SubscriptionGate (SUBSCRIPTION_EXEMPT_ROUTES)
- Usar authenticatedFetch() ou tRPC (que já faz refresh automático) — nunca fazer fetch manual para a API sem token
- Bloqueios do frontend são apenas UX — toda proteção real é no backend. O frontend bloqueia para guiar o usuário, não para proteger
