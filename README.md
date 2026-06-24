# Cipritravel Tours

Site estático (HTML + CSS + JS puro) com Cloudflare Pages Functions para o proxy do Web3Forms.
CMS gerido via Decap CMS em `/admin`.

---

## Deploy para Cloudflare Pages

O deploy é automático via GitHub Actions a cada push para `main`.

### 1. Criar o projecto na Cloudflare (uma única vez)

Podes fazer de duas formas:

**Opção A — Dashboard (recomendado para primeira vez):**
1. Vai a https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Create project manually**
2. Name: `cipritravel-tours`
3. Production branch: `main`
4. Framework preset: `None`
5. Build command: *(vazio)*
6. Build output directory: `.`
7. Clica **Save and Deploy** (podes cancelar o primeiro build — só precisamos que o projecto exista)

**Opção B — CLI:**
```bash
npx wrangler pages project create cipritravel-tours --production-branch=main
```

### 2. Configurar variáveis de ambiente

No dashboard Cloudflare Pages → **cipritravel-tours** → **Settings** → **Environment variables**:

| Variável | Valor |
|----------|-------|
| `WEB3FORMS_KEY` | A tua chave do Web3Forms |

Aplica ao ambiente **Production** (e opcionalmente Preview).

### 3. Adicionar secrets no GitHub

Vai ao GitHub → **Clawsion/Cipritravel-Tours** → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Secret | Onde obter |
|--------|-----------|
| `CLOUDFLARE_API_TOKEN` | https://dash.cloudflare.com/profile/api-tokens → **Create Token** → usa o template "Edit Cloudflare Workers" ou cria um customizado com permissões: **Account / Cloudflare Pages / Edit** |
| `CLOUDFLARE_ACCOUNT_ID` | Dashboard Cloudflare → qualquer domain → overview → **Account ID** (à direita) |

### 4. Disparar o primeiro deploy

GitHub → **Actions** → **Deploy to Cloudflare Pages** → **Run workflow**.

A partir do segundo deploy, qualquer push para `main` dispara automaticamente.

### 5. Configurar domínio customizado `www.cipritraveltours.com`

Dashboard Cloudflare Pages → **cipritravel-tours** → **Custom domains** → **Set up a custom domain**:

- Adiciona `www.cipritraveltours.com`
- Se o domínio **já estiver na Cloudflare**: a Cloudflare cria o CNAME automaticamente
- Se estiver noutro registrar: cria um CNAME `www` → `cipritravel-tours.pages.dev`
- (Opcional) Adiciona também `cipritraveltours.com` (apex) → a Cloudflare suporta CNAME flattening no apex

Espera 5–15 min para propagação DNS + emissão do certificado SSL.

### 6. Actualizar config do Decap CMS

Já está apontado para o repo correcto (`Clawsion/Cipritravel-Tours`) em `admin/config.yml`.
O `base_url` em `admin/config.yml` aponta para `https://cipritravel-auth.ludbek.workers.dev` — se esse auth worker ainda estiver activo, óptimo. Se não, precisará de ser substituído.

---

## Estrutura

```
.
├── index.html              # Página principal (hero, nav, containers)
├── assets/
│   ├── js/section.js       # Motor de renderização de secções
│   └── images/             # Logos, hero bg, uploads do CMS
├── data/                   # Conteúdo JSON gerido pelo Decap CMS
│   ├── config.json
│   ├── homepage.json
│   ├── menu.json
│   ├── footer.json
│   └── modais.json
├── admin/                  # Decap CMS (admin UI)
│   ├── index.html
│   └── config.yml
├── functions/
│   └── api/submit.js       # Cloudflare Pages Function (proxy Web3Forms)
├── _headers                # Cache + security headers (Cloudflare Pages)
├── _redirects              # Redirects (Cloudflare Pages)
└── .github/workflows/
    └── deploy-cloudflare-pages.yml   # CI/CD
```

---

## Notas

- **Sem build step.** O HTML é servido diretamente.
- A `WEB3FORMS_KEY` é lida pela Pages Function `functions/api/submit.js` — nunca exposta no cliente.
- O `config-env.js` (em `.gitignore`) era usado antigamente para a key do Web3Forms no cliente — já não é necessário, mas podes mantê-lo vazio para compatibilidade.
