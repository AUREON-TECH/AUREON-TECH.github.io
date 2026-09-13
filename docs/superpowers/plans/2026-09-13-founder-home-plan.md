# Raphael Bueno × AUREON Founder Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir a home atual por uma landing page premium de fundador, autoridade, projetos, canais sociais e conversão.

**Architecture:** Manter o projeto como site estático/PWA em GitHub Pages, usando HTML/CSS/JS sem dependências externas. A home continuará em `index.html`; a camada visual e interativa será autocontida e compatível com a infraestrutura atual.

**Tech Stack:** HTML5, CSS3, JavaScript vanilla, GitHub Pages, PWA existente.

**Spec:** `docs/superpowers/specs/2026-09-13-founder-home-design.md`

## Global Constraints
- Preservar GitHub Pages e PWA existente.
- Mobile-first e responsivo.
- Sem métricas ou resultados não comprovados.
- Sem dependências externas desnecessárias.
- CTAs principais: criar app, aprender e acompanhar projetos.
- Visual escuro premium com detalhes dourados discretos.

---

### Task 1: Founder landing page

**Files:**
- Modify: `index.html`
- Create: `tests/founder-home.test.js`

**Interfaces:**
- Consumes: infraestrutura PWA já existente (`manifest.webmanifest`, `sw.js`).
- Produces: uma home estática com seções `hero`, `build`, `paths`, `projects`, `social`, `contact`.

- [ ] **Step 1: Write the failing test**

Criar um teste Node simples que leia `index.html` e exija: `Raphael Bueno`, `AUREON`, `O que estou construindo`, `Quero criar meu app`, `Quero aprender`, `Instagram`, `YouTube`, `TikTok`, `Facebook`, `GitHub` e meta viewport.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/founder-home.test.js`
Expected: FAIL porque a home atual ainda não contém a nova estrutura completa.

- [ ] **Step 3: Write minimal implementation**

Substituir `index.html` por uma home mobile-first com hero de fundador, manifesto, projetos em destaque, caminhos Studio/Método, hub social, build in public e CTA final.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/founder-home.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

Commit message: `feat: launch Raphael Bueno founder home`

### Task 2: PWA metadata alignment

**Files:**
- Modify: `manifest.webmanifest`
- Modify: `sw.js` only if cache version or asset list requires refresh.

**Interfaces:**
- Consumes: nova identidade da home.
- Produces: nome/descrição coerentes no modo instalado e atualização de cache.

- [ ] **Step 1: Write the failing test**

Expandir o teste para exigir no manifest os nomes `Raphael Bueno` e `AUREON` e confirmar que `index.html` é o start URL ou está disponível no escopo atual.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/founder-home.test.js`
Expected: FAIL no manifesto antigo.

- [ ] **Step 3: Write minimal implementation**

Atualizar `manifest.webmanifest` para refletir a nova home e incrementar o cache do `sw.js` se necessário.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/founder-home.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

Commit message: `chore: align PWA metadata with founder home`

### Task 3: Review and release

**Files:**
- Verify: `index.html`, `manifest.webmanifest`, `sw.js`, `tests/founder-home.test.js`

**Interfaces:**
- Produces: versão pronta para publicar via PR/merge.

- [ ] **Step 1: Run complete verification**

Run: `node tests/founder-home.test.js`
Expected: PASS with no warnings.

- [ ] **Step 2: Inspect responsive structure**

Confirmar presença de `@media` para telas pequenas, `viewport-fit=cover`, foco em botões e navegação utilizável por toque.

- [ ] **Step 3: Open PR**

Abrir PR da branch de implementação para `main` com resumo das mudanças e validações.
