import test from "node:test";
import assert from "node:assert/strict";
import { buildWhatsAppMessage } from "../js/whatsapp.js";

test("commercial WhatsApp summary contains only the three adaptive build answers", () => {
  const message = buildWhatsAppMessage({
    route: "build",
    identity: { name: "Raphael" },
    answers: { goal: "management", stage: "process", solution: "app-database" },
    utm: { source: "facebook", content: "group" },
  }, { title: "AUREON Pro", priceLabel: "" });

  assert.match(message, /O que deseja criar: Gestão e produtividade/);
  assert.match(message, /Etapa atual: Já tenho um processo ou planilha/);
  assert.match(message, /Solução desejada: Aplicativo com login e banco de dados/);
  assert.doesNotMatch(message, /R\$|investimento/i);
  assert.doesNotMatch(message, /Cidade:/);
  assert.doesNotMatch(message, /E-mail:/);
});
