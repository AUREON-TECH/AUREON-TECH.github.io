import test from "node:test";
import assert from "node:assert/strict";
import { buildWhatsAppMessage } from "../js/whatsapp.js";

test("commercial WhatsApp summary contains only the three adaptive build answers", () => {
  const message = buildWhatsAppMessage({
    route: "build",
    identity: { name: "Raphael" },
    answers: { goal: "management", stage: "process", investment: "pro" },
    utm: { source: "facebook", content: "group" },
  }, { title: "AUREON Pro", priceLabel: "R$ 1.499,99" });

  assert.match(message, /O que deseja criar: Gestão e produtividade/);
  assert.match(message, /Etapa atual: Já tenho um processo ou planilha/);
  assert.match(message, /Faixa de investimento: Entre R\$ 600 e R\$ 1\.500/);
  assert.doesNotMatch(message, /Cidade:/);
  assert.doesNotMatch(message, /E-mail:/);
});
