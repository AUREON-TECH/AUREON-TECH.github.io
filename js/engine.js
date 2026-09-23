import { BUILD_QUESTIONS, LEARN_QUESTIONS } from "./questions.js";

const RECOMMENDATIONS = Object.freeze({
  start: { id: "start", title: "AUREON Start", description: "Um primeiro aplicativo adaptado ao seu nicho, com presença digital e contato direto.", priceLabel: "R$ 599,99", cta: "Conversar sobre meu aplicativo" },
  pro: { id: "pro", title: "AUREON Pro", description: "Aplicativo com login, banco de dados e painel administrativo.", priceLabel: "R$ 1.499,99", cta: "Planejar meu aplicativo Pro" },
  business: { id: "business", title: "AUREON Business", description: "Sistema personalizado para processos e integrações mais completas.", priceLabel: "a partir de R$ 2.999,99", cta: "Solicitar proposta personalizada" },
  saas: { id: "saas", title: "AUREON SaaS", description: "Plataforma com usuários, assinaturas e gestão contínua.", priceLabel: "Sob orçamento", cta: "Planejar minha plataforma" },
  "learn-entry": { id: "learn-entry", title: "Método AUREON", description: "Aprenda o processo prático para criar e publicar seu primeiro aplicativo.", priceLabel: "R$ 59,99", cta: "Acessar o Método AUREON — R$ 59,99", checkoutUrl: "https://pay.kiwify.com.br/NpaNtPV" },
  "learn-mentoring": { id: "learn-mentoring", title: "Mentoria AUREON", description: "Acompanhamento para desenvolver projetos e transformar a habilidade em renda.", priceLabel: "proposta personalizada", cta: "Quero falar sobre mentoria" },
});
function assertRoute(route) { if (route !== "build" && route !== "learn") throw new Error("Caminho do diagnóstico inválido"); }
export function getRouteQuestions(route) { assertRoute(route); return route === "build" ? BUILD_QUESTIONS : LEARN_QUESTIONS; }
export function getProgress(answered,total){ if(!Number.isInteger(answered)||!Number.isInteger(total)||total<=0)return 0; return Math.round(Math.min(1,Math.max(0,answered/total))*100); }
export function calculateRecommendation(route, answers = {}) {
  assertRoute(route);
  if (route === "learn") return RECOMMENDATIONS["learn-entry"];

  const offerByInvestment = {
    starter: "start",
    pro: "pro",
    business: "business",
    saas: "saas",
    unknown: "start",
  };
  return RECOMMENDATIONS[offerByInvestment[answers.investment] || "start"];
}
