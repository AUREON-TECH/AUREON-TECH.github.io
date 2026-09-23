import { getRouteQuestions, getProgress, calculateRecommendation } from "./engine.js";
import { validateIdentity, createSession, saveSession, loadSession, clearSession, readUtm } from "./state.js";
import { SITE_CONFIG } from "./site-config.js";
import { buildWhatsAppMessage, buildWhatsAppUrl, isPublishableNumber } from "./whatsapp.js";

const $ = (selector) => document.querySelector(selector);
const screens = [...document.querySelectorAll("[data-screen]")];
let session = createSession(readUtm(location.search));
let navIndex = 0;

function snapshot(step = session.step) {
  return { aureonDiagnostic: true, sessionId: session.id, step, questionIndex: session.questionIndex, route: session.route, navIndex };
}

function syncHistory(step, mode) {
  if (!mode) return;
  if (mode === "push") navIndex += 1;
  const state = snapshot(step);
  if (mode === "replace") history.replaceState(state, "", location.href);
  else history.pushState(state, "", location.href);
}

function show(id, { historyMode = "push" } = {}) {
  screens.forEach((node) => { node.hidden = node.id !== id; });
  $("#progress-wrap").hidden = id !== "question-screen";
  $("#restart-button").hidden = id === "start-screen";
  session.step = id;
  saveSession(localStorage, session);
  syncHistory(id, historyMode);
}

function fresh() {
  clearSession(localStorage);
  session = createSession(readUtm(location.search));
  navIndex = 0;
  show("start-screen", { historyMode: "replace" });
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

function hydrateIdentity() {
  const input = $("#name");
  if (input && session.identity?.name) input.value = session.identity.name;
}

function renderQuestion(options = {}) {
  const questions = getRouteQuestions(session.route);
  if (session.questionIndex >= questions.length) {
    hydrateIdentity();
    return show("identity-screen", options);
  }

  const q = questions[session.questionIndex];
  const progress = getProgress(session.questionIndex, questions.length);
  $("#progress-value").value = progress;
  $("#progress-percent").textContent = `${progress}%`;
  $("#progress-copy").textContent = `${session.questionIndex + 1} de ${questions.length}`;
  $("#conversation").innerHTML = `<article class="bubble"><span class="avatar">A</span><p>${q.prompt}</p></article>`;
  const saved = session.answers[q.id];
  const selected = Array.isArray(saved) ? saved : [saved];
  const optionsHtml = q.options.map((item) => `<label class="option-button"><input type="radio" name="answer" value="${item.value}" ${selected.includes(item.value) ? "checked" : ""}> ${item.label}</label>`).join("");
  $("#answer-form").innerHTML = `<fieldset><legend class="microcopy">Selecione uma opção</legend><div class="options">${optionsHtml}</div></fieldset><p class="field-error" data-question-error></p><button class="primary-button continue-button">Continuar →</button>`;

  $("#answer-form").querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener("change", () => setTimeout(() => $("#answer-form").requestSubmit(), 160), { once: true });
  });
  show("question-screen", options);
}

function renderResult(options = {}) {
  const result = calculateRecommendation(session.route, session.answers);
  session.recommendation = result;
  $("#result-title").textContent = `${session.identity.name}, encontramos o melhor caminho para você.`;
  $("#result-description").textContent = result.description;
  $("#result-product").textContent = result.title;
  const price = $("#result-price");
  price.textContent = result.priceLabel;
  price.hidden = !result.priceLabel;

  const primary = $("#whatsapp-button");
  const support = $("#support-button");
  const canWhatsApp = isPublishableNumber(SITE_CONFIG.whatsappNumber);
  const whatsappUrl = canWhatsApp ? buildWhatsAppUrl(SITE_CONFIG.whatsappNumber, buildWhatsAppMessage(session, result)) : "";

  support.hidden = true;
  if (result.checkoutUrl) {
    primary.disabled = false;
    primary.textContent = result.cta;
    primary.onclick = () => window.location.assign(result.checkoutUrl);
    if (canWhatsApp) {
      support.hidden = false;
      support.textContent = "Tirar uma dúvida no WhatsApp";
      support.onclick = () => window.location.assign(whatsappUrl);
    }
  } else if (canWhatsApp) {
    primary.disabled = false;
    primary.textContent = "Receber uma análise pelo WhatsApp";
    primary.onclick = () => window.location.assign(whatsappUrl);
  } else {
    primary.disabled = true;
    primary.textContent = "WhatsApp da AUREON em configuração";
  }
  show("result-screen", options);
}

function restoreCurrentStep({ historyMode = null } = {}) {
  hydrateIdentity();
  if (session.step === "question-screen" && session.route) return renderQuestion({ historyMode });
  if (session.step === "identity-screen" && session.route) return show("identity-screen", { historyMode });
  if (session.step === "result-screen" && session.route && session.identity?.name) return renderResult({ historyMode });
  const safeStep = ["start-screen", "route-screen"].includes(session.step) ? session.step : "start-screen";
  show(safeStep, { historyMode });
}

function fallbackBackQuestion() {
  if (session.questionIndex > 0) {
    session.questionIndex -= 1;
    renderQuestion({ historyMode: "replace" });
  } else show("route-screen", { historyMode: "replace" });
}

$("[data-action='start']").addEventListener("click", () => show("route-screen"));
$("[data-action='back-start']").addEventListener("click", () => show("start-screen", { historyMode: "replace" }));

document.querySelectorAll("[data-route]").forEach((button) => button.addEventListener("click", () => {
  session.route = button.dataset.route;
  session.questionIndex = 0;
  session.answers = {};
  session.identity = {};
  renderQuestion();
}));

$("#answer-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const questions = getRouteQuestions(session.route);
  const q = questions[session.questionIndex];
  const value = event.currentTarget.querySelector("input:checked")?.value || "";
  if (!value) {
    event.currentTarget.querySelector("[data-question-error]").textContent = "Escolha uma opção para continuar.";
    return;
  }
  session.answers[q.id] = value;
  session.questionIndex += 1;
  saveSession(localStorage, session);
  renderQuestion();
});

$("#identity-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const identity = { name: new FormData(event.currentTarget).get("name") };
  const validation = validateIdentity(identity);
  $("[data-error='name']").textContent = validation.errors.name || "";
  if (!validation.valid) return $("#name").focus();
  session.identity = identity;
  renderResult();
});

$("[data-action='back-question']").addEventListener("click", () => {
  if (navIndex > 0) history.back(); else fallbackBackQuestion();
});

$("[data-action='back-from-name']").addEventListener("click", () => {
  session.questionIndex = Math.max(0, getRouteQuestions(session.route).length - 1);
  renderQuestion({ historyMode: "replace" });
});

$("#restart-button").addEventListener("click", fresh);

window.addEventListener("popstate", (event) => {
  const state = event.state;
  if (!state?.aureonDiagnostic) return;
  if (state.sessionId && state.sessionId !== session.id) return fresh();
  navIndex = Number.isInteger(state.navIndex) ? state.navIndex : 0;
  const stored = loadSession(localStorage);
  if (stored) session = stored;
  session.step = state.step || "start-screen";
  if (Number.isInteger(state.questionIndex)) session.questionIndex = state.questionIndex;
  if (state.route) session.route = state.route;
  saveSession(localStorage, session);
  restoreCurrentStep();
});

clearSession(localStorage);
session = createSession(readUtm(location.search));
navIndex = 0;
show("start-screen", { historyMode: "replace" });

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    const registration = await navigator.serviceWorker.register("./sw.js?v=20260923-10", { updateViaCache: "none" });
    await registration.update();
  });
}
