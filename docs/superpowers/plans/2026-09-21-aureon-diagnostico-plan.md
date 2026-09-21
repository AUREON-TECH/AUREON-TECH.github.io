# Diagnóstico AUREON Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar https://aureon-tech.github.io/ em um diagnóstico conversacional que separa visitantes entre contratar um aplicativo e aprender a criar, recomenda a oferta adequada e abre o WhatsApp da AUREON com um resumo consentido.

**Architecture:** Aplicação estática em HTML, CSS e JavaScript modular, sem framework ou backend. Perguntas, pontuação, estado local, interface e geração do link do WhatsApp ficam em módulos separados e testáveis com o test runner nativo do Node.

**Tech Stack:** HTML5, CSS3, JavaScript ES modules, Node.js `node:test`, GitHub Pages e PWA existente.

**Spec:** `docs/superpowers/specs/2026-09-21-aureon-diagnostico-design.md`

## Global Constraints

- Manter a URL pública e o histórico Git do site atual.
- Identidade original AUREON; não copiar textos, fotos, ativos ou marca da referência.
- Priorizar Galaxy A14, navegador interno do Instagram, Chrome Android, Safari iPhone e desktop.
- Não enviar respostas silenciosamente; não capturar câmera, localização ou dados do aparelho.
- Exigir consentimento e manter respostas no navegador até a ação voluntária no WhatsApp.
- Não publicar CTA para número não confirmado.
- Preços: Aprender R$ 59,99; Start R$ 599,99; Pro R$ 1.499,99; Business a partir de R$ 2.999,99; SaaS a partir de R$ 4.999,99.
- Kiwify fica fora desta fase até existir checkout válido.

## Review Focus

- Bloqueio de abertura externa dentro do Instagram: manter botão acionado pelo usuário e instrução de continuidade.
- Recarregamento no meio do fluxo: oferecer restauração sem pular consentimento.
- Nome, telefone e e-mail inválidos: bloquear avanço e focar o erro.
- Acentos e emojis: codificar corretamente a mensagem do WhatsApp.
- Número comercial ausente: desativar CTA e impedir publicação.

---

## File Structure

- `index.html`: telas semânticas e pontos de montagem.
- `css/diagnostico.css`: identidade, responsividade e acessibilidade.
- `js/questions.js`: 18 perguntas, opções e pesos.
- `js/engine.js`: progresso e recomendação.
- `js/state.js`: validação, consentimento, UTM e sessão local.
- `js/site-config.js`: número comercial confirmado.
- `js/whatsapp.js`: resumo e URL `wa.me`.
- `js/app.js`: renderização e eventos.
- `terms.html`, `privacy.html`: transparência.
- `sw.js`, `manifest.webmanifest`: PWA.
- `tests/diagnostico-*.test.js`: testes automatizados.

### Task 1: Perguntas e motor de recomendação

**Files:**
- Create: `js/questions.js`
- Create: `js/engine.js`
- Create: `tests/diagnostico-engine.test.js`

**Interfaces:**
- Produces: `getRouteQuestions(route)`, `getProgress(answered,total)`, `calculateRecommendation(route,answers)`.
- Recommendation: `{ id, title, description, priceLabel, cta }`.

- [ ] **Step 1: Write failing tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { getRouteQuestions, getProgress, calculateRecommendation } from "../js/engine.js";

test("each route has nine questions", () => {
  assert.equal(getRouteQuestions("build").length, 9);
  assert.equal(getRouteQuestions("learn").length, 9);
});
test("progress is bounded", () => {
  assert.equal(getProgress(0, 9), 0);
  assert.equal(getProgress(9, 9), 100);
});
test("simple showcase maps to Start", () => {
  const result = calculateRecommendation("build", {
    goal:"showcase", essentials:["catalog","whatsapp"], investment:"starter"
  });
  assert.equal(result.id, "start");
  assert.equal(result.priceLabel, "R$ 599,99");
});
test("beginner maps to entry course", () => {
  const result = calculateRecommendation("learn", { level:"beginner", objective:"first-app" });
  assert.equal(result.id, "learn-entry");
  assert.equal(result.priceLabel, "R$ 59,99");
});
```

- [ ] **Step 2: Run RED**

Run: `node --test tests/diagnostico-engine.test.js`  
Expected: FAIL because modules do not exist.

- [ ] **Step 3: Implement questions and deterministic scoring**

Create the nine questions for each route from the spec. Use buckets `start`, `pro`, `business`, `saas`, `learn-entry` and `learn-mentoring`. Requirements such as marketplace, subscriptions, finance, advanced AI or complex integrations must never map to Start.

- [ ] **Step 4: Run GREEN**

Run: `node --test tests/diagnostico-engine.test.js`  
Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add js/questions.js js/engine.js tests/diagnostico-engine.test.js
git commit -m "feat: add diagnostic recommendation engine"
```

### Task 2: Validation, consentimento e estado local

**Files:**
- Create: `js/state.js`
- Create: `tests/diagnostico-state.test.js`

**Interfaces:**
- Produces: `validateIdentity(identity)`, `createSession(utm)`, `saveSession(storage,session)`, `loadSession(storage)`, `clearSession(storage)`, `readUtm(search)`.

- [ ] **Step 1: Write failing tests**

```js
test("requires valid identity and consent", () => {
  const result = validateIdentity({name:"R",phone:"123",email:"x",city:"",consent:false});
  assert.equal(result.valid, false);
  assert.deepEqual(Object.keys(result.errors).sort(), ["city","consent","email","name","phone"]);
});
test("keeps only approved UTM fields", () => {
  assert.deepEqual(readUtm("?utm_source=ig&utm_medium=social&token=x"), {
    source:"ig", medium:"social", campaign:"", content:""
  });
});
```

- [ ] **Step 2: Run RED**

Run: `node --test tests/diagnostico-state.test.js`  
Expected: FAIL because exports do not exist.

- [ ] **Step 3: Implement safe local state**

Accept Brazilian phones with 10 or 11 digits after normalization; require a valid email, name, city and consent. Persist under `aureon.diagnostic.v1`; expire after 24 hours; reject malformed JSON; store only approved UTM keys.

- [ ] **Step 4: Add restore/corruption tests and run GREEN**

Run: `node --test tests/diagnostico-state.test.js`  
Expected: all tests PASS, including malformed JSON returning `null`.

- [ ] **Step 5: Commit**

```bash
git add js/state.js tests/diagnostico-state.test.js
git commit -m "feat: add private local diagnostic state"
```

### Task 3: Interface conversacional original

**Files:**
- Modify: `index.html`
- Create: `css/diagnostico.css`
- Create: `js/app.js`
- Create: `tests/diagnostico-structure.test.js`

**Interfaces:**
- Consumes engine and state modules.
- DOM IDs: `start-screen`, `identity-screen`, `route-screen`, `question-screen`, `result-screen`, `progress-value`, `answer-form`, `restart-button`.

- [ ] **Step 1: Write failing structural test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("page contains all diagnostic screens", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  for (const id of ["start-screen","identity-screen","route-screen","question-screen","result-screen"]) {
    assert.ok(html.includes('id="' + id + '"'));
  }
  assert.doesNotMatch(html, /ARKOM|Bilhon/i);
});
```

- [ ] **Step 2: Run RED**

Run: `node --test tests/diagnostico-structure.test.js`  
Expected: FAIL because current homepage lacks screens.

- [ ] **Step 3: Build semantic screens**

Use one visible screen at a time, native `progress`, `aria-live="polite"`, bound labels, back/restart controls and `type="module"`. Never auto-open external links.

- [ ] **Step 4: Apply AUREON visual system**

Use `#06142d`, `#1574ff`, `#57b8ff`, `#d7b56d`, white text, 720px maximum width, 44px touch targets, safe-area padding, visible focus and `prefers-reduced-motion`. Use no copied assets or external fonts.

- [ ] **Step 5: Implement routing and restoration**

Render one question per screen; save after each valid response; back must preserve answers; refresh offers “Continuar diagnóstico”; restart clears stored answers.

- [ ] **Step 6: Run tests and commit**

Run: `node --test tests/diagnostico-*.test.js`  
Expected: all current tests PASS.

```bash
git add index.html css/diagnostico.css js/app.js tests/diagnostico-structure.test.js
git commit -m "feat: build AUREON conversational diagnostic"
```

### Task 4: Preços e entrega ao WhatsApp

**Files:**
- Create: `js/site-config.js`
- Create: `js/whatsapp.js`
- Modify: `js/app.js`
- Create: `tests/diagnostico-whatsapp.test.js`

**Interfaces:**
- Produces: `SITE_CONFIG.whatsappNumber`, `buildWhatsAppMessage(session,recommendation)`, `buildWhatsAppUrl(number,message)`.

- [ ] **Step 1: Write failing tests**

```js
test("rejects invalid business numbers", () => {
  assert.throws(() => buildWhatsAppUrl("", "Olá"), /número comercial/i);
});
test("encodes visitor and recommendation", () => {
  const message = buildWhatsAppMessage({
    identity:{name:"José",city:"São Paulo"}, route:"build",
    answers:{segment:"Educação"}, utm:{source:"ig",content:"link_in_bio"}
  }, {title:"AUREON Start",priceLabel:"R$ 599,99"});
  const url = buildWhatsAppUrl("5511999999999", message);
  assert.match(decodeURIComponent(url), /José/);
  assert.match(decodeURIComponent(url), /R\$ 599,99/);
});
```

- [ ] **Step 2: Run RED**

Run: `node --test tests/diagnostico-whatsapp.test.js`  
Expected: FAIL because module does not exist.

- [ ] **Step 3: Implement message and result cards**

Generate `https://wa.me/<digits>?text=<encoded>`. Include only supplied answers, route, recommendation, approved price and UTM. Render the five approved offers and the SaaS support note without implying every project cabe no pacote Start.

- [ ] **Step 4: Add production-number gate**

The config must match `^55\\d{10,11}$`. While the new number is not confirmed, disable the CTA with “WhatsApp da AUREON em configuração”. Before deployment, insert the confirmed digits and make this test pass:

```js
test("production number is publishable", () => {
  assert.match(SITE_CONFIG.whatsappNumber, /^55\d{10,11}$/);
});
```

- [ ] **Step 5: Run GREEN and commit**

Run: `node --test tests/diagnostico-whatsapp.test.js tests/diagnostico-engine.test.js`  
Expected: all tests PASS after number confirmation.

```bash
git add js/site-config.js js/whatsapp.js js/app.js tests/diagnostico-whatsapp.test.js
git commit -m "feat: add priced WhatsApp handoff"
```

### Task 5: Termos e privacidade

**Files:**
- Create: `terms.html`
- Create: `privacy.html`
- Modify: `index.html`
- Modify: `tests/diagnostico-structure.test.js`

**Interfaces:**
- Produces public legal pages linked beside consent.

- [ ] **Step 1: Add failing privacy test**

```js
test("privacy explains local and voluntary handling", async () => {
  const text = await readFile(new URL("../privacy.html", import.meta.url), "utf8");
  assert.match(text, /dispositivo/i);
  assert.match(text, /WhatsApp/i);
  assert.match(text, /reiniciar.*apagar/i);
});
```

- [ ] **Step 2: Run RED**

Run: `node --test tests/diagnostico-structure.test.js`  
Expected: FAIL because legal pages do not exist.

- [ ] **Step 3: Write plain-language pages**

Explain purpose, requested fields, 24-hour local session, voluntary WhatsApp handoff, UTM use, no camera/location/device capture and answer deletion. Do not claim a legal certification.

- [ ] **Step 4: Prove there is no invisible submission**

Scan project HTML/JS in the test and fail on `fetch(`, `XMLHttpRequest`, `sendBeacon` or an external form action.

- [ ] **Step 5: Run GREEN and commit**

Run: `node --test tests/diagnostico-structure.test.js tests/diagnostico-state.test.js`  
Expected: all tests PASS.

```bash
git add terms.html privacy.html index.html tests/diagnostico-structure.test.js
git commit -m "feat: add transparent privacy flow"
```

### Task 6: PWA, mobile verification and deployment

**Files:**
- Modify: `manifest.webmanifest`
- Modify: `sw.js`
- Modify: `tests/diagnostico-structure.test.js`
- Modify or Create: `README.md`
- Create: `docs/diagnostico-delivery-2026-09-21.md`

**Interfaces:**
- Consumes all public assets and produces versioned offline shell plus delivery evidence.

- [ ] **Step 1: Write failing PWA asset test**

Assert `sw.js` contains `./index.html`, CSS, every JS module, terms and privacy. Assert the manifest name is “Diagnóstico AUREON”.

- [ ] **Step 2: Run RED**

Run: `node --test tests/diagnostico-structure.test.js`  
Expected: FAIL against old cache/manifest.

- [ ] **Step 3: Update PWA safely**

Increment cache name; delete old versions on activate; use network-first navigation and stale-while-revalidate for same-origin static files; never cache WhatsApp/external URLs.

- [ ] **Step 4: Document operation**

Explain prices, file roles, confirmed-number change, `node --test tests/*.test.js`, rollback and why Kiwify is not yet active.

- [ ] **Step 5: Run complete automated suite**

Run: `node --test tests/*.test.js`  
Expected: zero failures.

- [ ] **Step 6: Run mobile checks**

Serve with `python -m http.server 4173`. Test 360×800 and 412×915: both routes, back, invalid fields, reload/restore, correct result, WhatsApp preview without sending, UTM URL, reduced motion, console, cache update and horizontal overflow.

- [ ] **Step 7: Commit verification**

```bash
git add manifest.webmanifest sw.js README.md tests/diagnostico-structure.test.js docs/diagnostico-delivery-2026-09-21.md
git commit -m "test: verify AUREON diagnostic delivery"
```

- [ ] **Step 8: Deploy and verify Pages**

Push `main`, verify the GitHub Pages workflow and open:
`https://aureon-tech.github.io/?utm_source=ig&utm_medium=social&utm_content=link_in_bio`.

Record deployed SHA, workflow result, URL, browser/device matrix and limitations in the delivery document.
