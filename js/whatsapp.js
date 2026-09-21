export function isPublishableNumber(value) { return /^55\d{10,11}$/.test(String(value || "").replace(/\D/g, "")); }

export function buildWhatsAppMessage(session, recommendation) {
  const route = session.route === "build" ? "quero criar um aplicativo" : "quero aprender a criar aplicativos";
  const rows = [
    `Olá, Raphael. Fiz o Diagnóstico AUREON e ${route}.`,
    `Nome: ${session.identity?.name || "Não informado"}`,
    `Cidade: ${session.identity?.city || "Não informada"}`,
    `Recomendação: ${recommendation.title} — ${recommendation.priceLabel}`,
  ];
  for (const [key, raw] of Object.entries(session.answers || {})) {
    const value = Array.isArray(raw) ? raw.join(", ") : raw;
    if (value) rows.push(`${key}: ${value}`);
  }
  if (session.utm?.source) rows.push(`Origem: ${session.utm.source}${session.utm.content ? ` / ${session.utm.content}` : ""}`);
  return rows.join("\n");
}

export function buildWhatsAppUrl(number, message) {
  const digits = String(number || "").replace(/\D/g, "");
  if (!isPublishableNumber(digits)) throw new Error("Número comercial da AUREON inválido");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
