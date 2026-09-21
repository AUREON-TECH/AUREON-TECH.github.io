import test from "node:test";
import assert from "node:assert/strict";
import { SITE_CONFIG } from "../js/site-config.js";
import { buildWhatsAppMessage, buildWhatsAppUrl, isPublishableNumber } from "../js/whatsapp.js";

test("rejects invalid business numbers", () => {
  assert.throws(() => buildWhatsAppUrl("", "Olá"), /número comercial/i);
  assert.throws(() => buildWhatsAppUrl("123", "Olá"), /número comercial/i);
});

test("encodes visitor and recommendation", () => {
  const message = buildWhatsAppMessage({ identity:{name:"José",city:"São Paulo"}, route:"build", answers:{segment:"Educação"}, utm:{source:"ig",content:"link_in_bio"} }, {title:"AUREON Start",priceLabel:"R$ 599,99"});
  const url = buildWhatsAppUrl("5511999999999", message);
  assert.match(decodeURIComponent(url), /José/);
  assert.match(decodeURIComponent(url), /R\$ 599,99/);
  assert.doesNotMatch(message, /user agent|session/i);
});

test("confirmed AUREON Business number enables publishing", () => {
  assert.equal(SITE_CONFIG.whatsappNumber, "5511926868865");
  assert.equal(isPublishableNumber(SITE_CONFIG.whatsappNumber), true);
});


test("translates internal diagnostic codes into client-friendly Portuguese", () => {
  const message = buildWhatsAppMessage({
    identity:{name:"Bueno Invest",city:"Campos do Jordão",email:"contato@exemplo.com"},
    route:"build",
    answers:{
      segment:"RESULTADOS CAPTAÇÃO",
      problem:"TOMAR DECISÕES BASEADAS EM RESULTADOS",
      users:"team",
      goal:"operations",
      essentials:["whatsapp","login","database","admin","subscriptions"],
      existing:"none",
      start:"now",
      investment:"business",
      solution:"unknown"
    },
    utm:{source:"ig",content:"link_in_bio"}
  }, {title:"AUREON SaaS",priceLabel:"Sob orçamento — faça sua oferta"});

  assert.match(message, /Quem vai usar: Minha equipe/);
  assert.match(message, /Objetivo principal: Organizar atendimentos/);
  assert.match(message, /Funções indispensáveis: WhatsApp, Login, Banco de dados, Painel administrativo, Pagamentos recorrentes/);
  assert.match(message, /Faixa de investimento: Até R\$ 3\.000/);
  assert.match(message, /Formato desejado: Preciso de orientação/);
  assert.match(message, /Origem: Instagram \/ Link na bio/);
  assert.doesNotMatch(message, /segment:|problem:|users:|goal:|essentials:|existing:|investment:|solution:|\bteam\b|\bunknown\b/i);
});
