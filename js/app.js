import { getRouteQuestions, getProgress, calculateRecommendation } from "./engine.js";
import { validateIdentity, createSession, saveSession, loadSession, clearSession, readUtm } from "./state.js";
import { SITE_CONFIG } from "./site-config.js";
import { buildWhatsAppMessage, buildWhatsAppUrl, isPublishableNumber } from "./whatsapp.js";

const $ = (selector) => document.querySelector(selector);
const screens = [...document.querySelectorAll("[data-screen]")];
let session = createSession(readUtm(location.search));

function show(id) {
  screens.forEach((node) => { node.hidden = node.id !== id; });
  $("#progress-wrap").hidden = id !== "question-screen";
  $("#restart-button").hidden = id === "start-screen";
  session.step = id;
  saveSession(localStorage, session);
}

function fresh() { clearSession(localStorage); session = createSession(readUtm(location.search)); $("#resume-dialog").hidden = true; show("identity-screen"); }
function esc(value) { return String(value).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c])); }

function renderQuestion() {
  const questions = getRouteQuestions(session.route);
  if (session.questionIndex >= questions.length) return renderResult();
  const q = questions[session.questionIndex];
  const progress = getProgress(session.questionIndex, questions.length);
  $("#progress-value").value = progress; $("#progress-percent").textContent = `${progress}%`; $("#progress-copy").textContent = `${session.questionIndex + 1} de ${questions.length}`;
  $("#conversation").innerHTML = `<article class="bubble"><span class="avatar">A</span><p>${q.prompt}</p></article>`;
  const saved = session.answers[q.id];
  if (q.type === "text") {
    $("#answer-form").innerHTML = `<label for="current-answer">Sua resposta</label><input id="current-answer" name="answer" value="${esc(saved || "")}"><p class="field-error" data-question-error></p><button class="primary-button">Continuar →</button>`;
  } else {
    const selected = Array.isArray(saved) ? saved : [saved];
    const type = q.type === "multi" ? "checkbox" : "radio";
    const options = q.options.map((item) => `<label class="option-button"><input type="${type}" name="answer" value="${item.value}" ${selected.includes(item.value) ? "checked" : ""}> ${item.label}</label>`).join("");
    $("#answer-form").innerHTML = `<fieldset><legend class="microcopy">${q.type === "multi" ? "Selecione uma ou mais opções" : "Selecione uma opção"}</legend><div class="options">${options}</div></fieldset><p class="field-error" data-question-error></p><button class="primary-button">Continuar →</button>`;
  }
  show("question-screen");
}

function answerValue(form, q) {
  if (q.type === "multi") return [...form.querySelectorAll("input:checked")].map((i) => i.value);
  if (q.type === "single") return form.querySelector("input:checked")?.value || "";
  return form.querySelector("input")?.value.trim() || "";
}

function renderResult() {
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
  show("result-screen");
}

$("[data-action='start']").addEventListener("click", () => show("identity-screen"));
$("#identity-form").addEventListener("submit", (event) => {
  event.preventDefault(); const data = new FormData(event.currentTarget);
  const identity = { name:data.get("name"), phone:data.get("phone"), email:data.get("email"), city:data.get("city"), consent:data.get("consent") === "on" };
  const validation = validateIdentity(identity);
  document.querySelectorAll("[data-error]").forEach((node) => { node.textContent = validation.errors[node.dataset.error] || ""; });
  if (!validation.valid) return $(`#${Object.keys(validation.errors)[0]}`)?.focus();
  session.identity = identity; $("#route-greeting").textContent = `Obrigado, ${identity.name}. Qual resultado você busca agora?`; show("route-screen");
});
document.querySelectorAll("[data-route]").forEach((button) => button.addEventListener("click", () => { session.route = button.dataset.route; session.questionIndex = 0; session.answers = {}; renderQuestion(); }));
$("#answer-form").addEventListener("submit", (event) => {
  event.preventDefault(); const questions = getRouteQuestions(session.route); const q = questions[session.questionIndex]; const value = answerValue(event.currentTarget, q);
  if (q.required && (!value || value.length === 0)) return event.currentTarget.querySelector("[data-question-error]").textContent = "Responda para continuar.";
  session.answers[q.id] = value; session.questionIndex += 1; saveSession(localStorage, session); renderQuestion();
});
$("[data-action='back-question']").addEventListener("click", () => { if (session.questionIndex > 0) { session.questionIndex -= 1; renderQuestion(); } else show("route-screen"); });
$("[data-action='back-identity']").addEventListener("click", () => show("identity-screen"));
$("#restart-button").addEventListener("click", fresh);
function restoreCurrentStep() {
  $("#resume-dialog").hidden = true;
  if (session.identity?.name) $("#route-greeting").textContent = `Obrigado, ${session.identity.name}. Qual resultado você busca agora?`;
  if (session.step === "question-screen") return renderQuestion();
  if (session.step === "result-screen") return renderResult();
  show(session.step || "identity-screen");
}

$("[data-action='resume']").addEventListener("click", restoreCurrentStep);
$("[data-action='discard']").addEventListener("click", fresh);

const TAB_SESSION_KEY = "aureon.diagnostic.activeTab";
const stored = loadSession(localStorage);
const isSameTabNavigation = sessionStorage.getItem(TAB_SESSION_KEY) === "1";
sessionStorage.setItem(TAB_SESSION_KEY, "1");

if (stored?.step && stored.step !== "start-screen") {
  session = stored;
  if (isSameTabNavigation) restoreCurrentStep();
  else $("#resume-dialog").hidden = false;
}

if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));
