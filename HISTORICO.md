# Histórico de alterações (SCA - Frontend)

## Últimas mudanças
- Atualizado em 2025-12-01 03:01:35
- src/app/features/settings/settings.component.ts (modificado: 2025-12-01 02:22:06)
- src/app/features/settings/settings.component.html (modificado: 2025-12-01 02:22:06)
- src/app/features/auth/login.component.html (modificado: 2025-12-01 02:22:05)
- src/app/core/ui/loading.service.ts (modificado: 2025-12-01 02:22:05)
- src/app/core/auth/guest.guard.ts (modificado: 2025-12-01 02:22:05)
- src/app/core/auth/auth.service.ts (modificado: 2025-12-01 02:22:05)
- src/app/core/auth/auth.interceptor.ts (modificado: 2025-12-01 02:22:05)
- src/app/app.ts (modificado: 2025-12-01 02:22:05)
- src/app/app.scss (modificado: 2025-12-01 02:22:05)
- src/app/app.html (modificado: 2025-12-01 02:22:01)


### Commits recentes
- 6e507f6 feat(auth): add loading overlay and improve error handling (mcmoriam, 2025-11-30 20:24:24 -0300)
- e6173d3 feat(auth): implement authentication system with guards and interceptor (mcmoriam, 2025-11-30 17:55:42 -0300)
- 79a93fe feat: initialize angular project with basic admin dashboard structure (mcmoriam, 2025-11-28 22:23:46 -0300)
- cff2079 Added README.md, .gitignore (Node) files (Claudio Amorim de Santana, 2025-11-29 00:22:01 +0000)

### Conversas recentes
# Conversas e respostas (SCA - Frontend)

## Registro
- Copie aqui trechos relevantes das conversas e respostas para consulta futura.
- Linhas mais recentes serão mostradas em “Conversas recentes” dentro do HISTORICO.md.
- Para limitar quantas linhas entram no resumo, defina `HISTORY_CHAT_LINES_LIMIT`.

## Último resumo
- Este arquivo é apenas um repositório de conversa; edite livremente.


## Resumo
- Fluxo de autenticação com redirecionamento, interceptor de `Authorization` e layout oculto no login.
- Menu do usuário na toolbar com avatar de iniciais e ação de logout.
- Tratamento de erros no login com mensagens por status e erros de campo.
- Overlay global de carregamento com mensagem e ícone contextuais, delay mínimo configurável.
- Página de Configurações com controle do delay do overlay persistido em `localStorage`.

## Autenticação e Navegação
- `src/app/core/auth/auth.service.ts:23-54`
  - Métodos `login` e `logout` com persistência em `localStorage` (`auth_token`, `auth_user`).
  - Parser resiliente para respostas: `token | accessToken | access_token`, `user | data.user`.
- `src/app/core/auth/guest.guard.ts:1-12`
  - Bloqueia acesso ao `/login` se autenticado, redirecionando para `/dashboard`.
- `src/app/core/auth/auth.guard.ts:1-12` e `src/app/core/auth/admin.guard.ts:1-11`
  - Proteção de rotas autenticadas e admin.
- `src/app/features/auth/login.component.ts:40-64`
  - Navegação pós-login com `router.navigate(['/dashboard'], { replaceUrl: true })`.
- `src/app/app.ts:59-69`
  - `loginView` atualizado em `NavigationEnd` usando `urlAfterRedirects`.

## Interceptor HTTP
- `src/app/core/auth/auth.interceptor.ts:1-15`
  - Anexa `Authorization: Bearer <token>` quando disponível, exceto no endpoint de login.
  - Integra loading global com `finalize` e mensagem contextual.
- Registrado em `src/app/app.config.ts:9-16` com `provideHttpClient(withInterceptors([authInterceptor]))`.

## Layout e Toolbar
- `src/app/app.html:1-80`
  - Layout oculto no login (`*ngIf="!loginView()"` / `loginView()`).
  - Toolbar com avatar de iniciais e menu do usuário.
- `src/app/app.ts:17-35,57-69,84-90`
  - Inicialização de sinais, injeção de `AuthService` e `LoadingService`.
  - Método `initials()` para avatar.
- `src/app/app.scss:28-44,142-151,152-155`
  - Estilos do avatar (`.avatar-initials`).
  - Overlay global (`.auth-loading-overlay`) com variante `.auth` para autenticação.

## Login (UI e Erros)
- `src/app/features/auth/login.component.html:1-29`
  - Exibição de erros de campo (`email`, `password`) e mensagem global `errorMsg`.
- `src/app/features/auth/login.component.ts:66-77`
  - Mensagens por status: `0`, `400`, `401`, `403`, `>=500`.
- `src/app/features/auth/login.component.ts:81-104`
  - Mapeia erros do backend para controles: `{ errors: { campo } }` e `{ errors: [{ field, message }] }`.
- `src/app/features/auth/login.component.ts:104-115`
  - Limpa erros de servidor antes de novo envio.

## Proxy de Desenvolvimento
- `angular.json:62-74`
  - `serve` usa `proxy.conf.json` em `development`.
- `proxy.conf.json:1-8`
  - Roteia `/api` para `http://localhost:3000`.

## Overlay Global de Carregamento
- `src/app/core/ui/loading.service.ts:1-58`
  - Serviço com `signal` para visibilidade, mensagem e tipo (`auth`/`default`).
  - Delay mínimo configurável, com tempo mínimo (anti-“piscar”).
  - Leitura/escrita de `ui.loading.minDelay` em `localStorage`.
- `src/app/app.html:78-84`
  - Overlay global com spinner, ícone e mensagem dinâmica.
- `src/app/app.config.ts:1-16`
  - Provider de fallback do delay por ambiente (`isDevMode()` → 150 ms | 250 ms).

## Configurações
- `src/app/features/settings/settings.component.ts:1-48`
  - Página standalone com formulário para alterar o delay do overlay.
- `src/app/features/settings/settings.component.html:1-16`
  - Campo numérico com validações e ação “Salvar”; feedback via snackbar.

## Observações
- Build validado após cada alteração significativa.
- Sem mudanças em contratos de API; ajustes de parse garantem compatibilidade com variações comuns de payload.
- Segurança: nenhum segredo exposto; tokens mantidos em `localStorage` apenas para sessão do cliente.
