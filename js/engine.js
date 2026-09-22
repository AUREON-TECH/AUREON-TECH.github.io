import { BUILD_QUESTIONS, LEARN_QUESTIONS } from "./questions.js";

const RECOMMENDATIONS = Object.freeze({
  start: { id: "start", title: "AUREON Start", description: "Um primeiro aplicativo adaptado ao seu nicho, com presença digital e contato direto.", priceLabel: "R$ 599,99", cta: "Conversar sobre meu aplicativo" },
  pro: { id: "pro", title: "AUREON Pro", description: "Aplicativo com login, banco de dados e painel administrativo.", priceLabel: "R$ 1.499,99", cta: "Planejar meu aplicativo Pro" },
  business: { id: "business", title: "AUREON Business", description: "Sistema personalizado para processos e integrações mais completas.", priceLabel: "a partir de R$ 2.999,99", cta: "Solicitar proposta personalizada" },
  saas: { id: "saas", title: "AUREON SaaS", description: "Plataforma com usuários, assinaturas e gestão contínua.", priceLabel: "Sob orçamento", cta: "Planejar minha plataforma" },
  "learn-entry": { id: "learn-entry", title: "Método AUREON", description: "Aprenda o processo prático para criar e publicar seu primeiro aplicativo.", priceLabel: "R$ 59,99", cta: "Acessar o Método AUREON — R$ 59,99", checkoutUrl: "https://pay.kiwify.com.br/NpaNtPV" },
  "learn-mentoring": { id: "learn-mentoring", title: "Mentoria AUREON", description: "Acompanhamento para desenvolver projetos e transformar a habilidade em renda.", priceLabel: "proposta personalizada", cta: "Quero falar sobre mentoria" },
});

function assertRoute(route) {
  if (route !== "build" && route !== "learn") throw new Error("Caminho do diagnóstico inválido");
}

export function getRouteQuestions(route) {
  assertRoute(route);
  return route === "build" ? BUILD_QUESTIONS : LEARN_QUESTIONS;
}

export function getProgress(answered, total) {
  if (!Number.isInteger(answered) || !Number.isInteger(total) || total <= 0) return 0;
  return Math.round(Math.min(1, Math.max(0, answered / total)) * 100);
}

function addScores(bucket, scores = {}) {
  for (const [key, value] of Object.entries(scores)) bucket[key] = (bucket[key] || 0) + value;
}

function scoreAnswers(questions, answers) {
  const scores = {};
  for (const question of questions) {
    const values = Array.isArray(answers[question.id]) ? answers[question.id] : [answers[question.id]];
    for (const value of values) {
      const selected = question.options?.find((entry) => entry.value === value);
      if (selected) addScores(scores, selected.scores);
    }
  }
  return scores;
}

export function calculateRecommendation(route, answers = {}) {
  assertRoute(route);
  const questions = getRouteQuestions(route);
  const scores = scoreAnswers(questions, answers);

  if (route === "learn") {
    const id = (scores["learn-mentoring"] || 0) > (scores["learn-entry"] || 0) ? "learn-mentoring" : "learn-entry";
    return RECOMMENDATIONS[id];
  }

  const complex = new Set(["marketplace", "subscriptions", "finance", "advanced-ai", "integrations"]);
  const essentials = Array.isArray(answers.essentials) ? answers.essentials : [];
  if (essentials.some((item) => complex.has(item))) {
    const id = essentials.includes("subscriptions") ? "saas" : "business";
    return RECOMMENDATIONS[id];
  }

  const order = ["start", "pro", "business", "saas"];
  const id = order.reduce((best, current) => (scores[current] || 0) > (scores[best] || 0) ? current : best, "start");
  return RECOMMENDATIONS[id];
}
