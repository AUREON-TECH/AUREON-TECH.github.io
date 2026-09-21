import { getRouteQuestions, getProgress, calculateRecommendation } from "./engine.js";
import { validateIdentity, createSession, saveSession, loadSession, clearSession, readUtm } from "./state.js";
import { SITE_CONFIG } from "./site-config.js";
import { buildWhatsAppMessage, buildWhatsAppUrl, isPublishableNumber } from "./whatsapp.js";

const $ = (selector) => document.querySelector(selector);
const screens = [...document.querySelectorAll("[data-screen]")];
let session = createSession(readUtm(location.search));
let navIndex = 0;

function snapshot(step = session.step) {
  return {
    aureonDiagnostic: true,
    sessionId: session.id,
    step,
    questionIndex: session.questionIndex,
    route: session.route,
    navIndex,
  };
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
  show("identity-screen", { historyMode: "replace" });
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

function hydrateIdentity() {
  if (!session.identity) return;
  const fields = ["name", "phone", "email", "city"];
  fields.forEach((key) => {
    const input = $("#" + key);
    if (input && session.identity[key] != null) input.value = session.identity[key];
  });
  const consent = $("#consent");
  if (consent) consent.checked = session.identity.consent === true;
}

function renderQuestion(options = {}) {
  const questions = getRouteQuestions(session.route);
  if (session.questionIndex >= questions.length) return renderResult(options);
  const q = questions[session.questionIndex];
  const progress = getProgress(session.questionIndex, questions.length);
  $("#progress-value").value = progress;
  $("#progress-percent").textContent = `${progress}%`;
  $("#progress-copy").textContent = `${session.questionIndex + 1} de ${questions.length}`;
  $("#conversation").innerHTML = `<article class="bubble"><span class="avatar">A</span><p>${q.prompt}</p></article>`;
  const saved = session.answers[q.id];

  if (q.type === "text") {
    $("#answer-form").innerHTML = `<label for="current-answer">Sua resposta</label><input id="current-answer" name="answer" value="${esc(saved || "")}"><p class="field-error" data-question-error></p><button class="primary-button">Continuar →</button>`;
  } else {
    const selected = Array.isArray(saved) ? saved : [saved];
    const type = q.type === "multi" ? "checkbox" : "radio";
    const optionsHtml = q.options.map((item) => `<label class="option-button"><input type="${type}" name="answer" value="${item.value}" ${selected.includes(item.value) ? "checked" : ""}> ${item.label}</label>`).join("");
    $("#answer-form").innerHTML = `<fieldset><legend class="microcopy">${q.type === "multi" ? "Selecione uma ou mais opções" : "Selecione uma opção"}</legend><div class="options">${optionsHtml}</div></fieldset><p class="field-error" data-question-error></p><button class="primary-button">Continuar →</button>`;
  }

  show("question-screen", options);
}

function answerValue(form, q) {
  if (q.type === "multi") return [...form.querySelectorAll("input:checked")].map((i) => i.value);
  if (q.type === "single") return form.querySelector("input:checked")?.value || "";
  return form.querySelector("input")?.value.trim() || "";
}

function renderResult(options = {}) {
  const result = calculateRecommendation(session.route, session.answers);
  session.recommendation = result;
  $("#result-title").textContent = `${session.identity.name}, encontramos o melhor caminho para você.`;
  $("#result-description").textContent = result.description;
  $("#result-product").textContent = result.title;
  $("#result-price").textContent = result.priceLabel;
  const button = $("#whatsapp-button");

  if (isPublishableNumber(SITE_CONFIG.whatsappNumber)) {
    button.disabled = false;
    button.textContent = result.cta;
    button.onclick = () => window.location.assign(buildWhatsAppUrl(SITE_CONFIG.whatsappNumber, buildWhatsAppMessage(session, result)));
  } else {
    button.disabled = true;
    button.textContent = "WhatsApp da AUREON em configuração";
  }

  show("result-screen", options);
}

function restoreCurrentStep({ historyMode = null } = {}) {
  hydrateIdentity();
  if (session.identity?.name) {
    $("#route-greeting").textContent = `Obrigado, ${session.identity.name}. Qual resultado você busca agora?`;
  }
  if (session.step === "question-screen" && session.route) return renderQuestion({ historyMode });
  if (session.step === "result-screen" && session.route) return renderResult({ historyMode });
  const safeStep = ["start-screen", "identity-screen", "route-screen"].includes(session.step) ? session.step : "identity-screen";
  show(safeStep, { historyMode });
}

function fallbackBackQuestion() {
  if (session.questionIndex > 0) {
    session.questionIndex -= 1;
    renderQuestion({ historyMode: "replace" });
  } else {
    show("route-screen", { historyMode: "replace" });
  }
}

$("[data-action='start']").addEventListener("click", () => show("identity-screen"));

$("#identity-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const identity = {
    name: data.get("name"),
    phone: data.get("phone"),
    email: data.get("email"),
    city: data.get("city"),
    consent: data.get("consent") === "on",
  };
  const validation = validateIdentity(identity);
  document.querySelectorAll("[data-error]").forEach((node) => {
    node.textContent = validation.errors[node.dataset.error] || "";
  });
  if (!validation.valid) return $("#" + Object.keys(validation.errors)[0])?.focus();

  session.identity = identity;
  $("#route-greeting").textContent = `Obrigado, ${identity.name}. Qual resultado você busca agora?`;
  show("route-screen");
});

document.querySelectorAll("[data-route]").forEach((button) => button.addEventListener("click", () => {
  session.route = button.dataset.route;
  session.questionIndex = 0;
  session.answers = {};
  renderQuestion();
}));

$("#answer-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const questions = getRouteQuestions(session.route);
  const q = questions[session.questionIndex];
  const value = answerValue(event.currentTarget, q);
  if (q.required && (!value || value.length === 0)) {
    event.currentTarget.querySelector("[data-question-error]").textContent = "Responda para continuar.";
    return;
  }
  session.answers[q.id] = value;
  session.questionIndex += 1;
  saveSession(localStorage, session);
  renderQuestion();
});

$("[data-action='back-question']").addEventListener("click", () => {
  if (navIndex > 0) history.back();
  else fallbackBackQuestion();
});

$("[data-action='back-identity']").addEventListener("click", () => {
  if (navIndex > 0) history.back();
  else show("identity-screen", { historyMode: "replace" });
});

$("#restart-button").addEventListener("click", fresh);

window.addEventListener("popstate", (event) => {
  const state = event.state;
  if (!state?.aureonDiagnostic) return;

  if (state.sessionId && state.sessionId !== session.id) {
    navIndex = 0;
    show("identity-screen", { historyMode: "replace" });
    return;
  }

  navIndex = Number.isInteger(state.navIndex) ? state.navIndex : 0;
  const stored = loadSession(localStorage);
  if (stored) session = stored;
  session.step = state.step || "identity-screen";
  if (Number.isInteger(state.questionIndex)) session.questionIndex = state.questionIndex;
  if (state.route) session.route = state.route;
  saveSession(localStorage, session);
  restoreCurrentStep();
});

const stored = loadSession(localStorage);
if (stored?.step && stored.step !== "start-screen") {
  session = stored;
  navIndex = 0;
  restoreCurrentStep({ historyMode: "replace" });
} else {
  session.step = "start-screen";
  show("start-screen", { historyMode: "replace" });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      const key = "aureon.sw.reload.20260921-6";
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
      location.reload();
    });

    const registration = await navigator.serviceWorker.register("./sw.js?v=20260921-6", { updateViaCache: "none" });
    await registration.update();
  });
}
