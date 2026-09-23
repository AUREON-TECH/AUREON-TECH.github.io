import test from "node:test";
import assert from "node:assert/strict";
import { SITE_CONFIG } from "../js/site-config.js";
import { buildWhatsAppMessage, buildWhatsAppUrl, isPublishableNumber } from "../js/whatsapp.js";

test("rejects invalid business numbers", () => {
  assert.throws(() => buildWhatsAppUrl("", "Olá"), /número comercial/i);
  assert.throws(() => buildWhatsAppUrl("123", "Olá"), /número comercial/i);
});

test("encodes visitor and recommendation without exposing build prices", () => {
  const message = buildWhatsAppMessage({ identity:{name:"José"}, route:"build", answers:{goal:"customers",stage:"idea",solution:"first-app"}, utm:{source:"ig",content:"link_in_bio"} }, {title:"AUREON Start",priceLabel:""});
  const url = buildWhatsAppUrl("5511999999999", message);
  assert.match(decodeURIComponent(url), /José/);
  assert.match(decodeURIComponent(url), /AUREON Start/);
  assert.doesNotMatch(message, /R\$/);
  assert.doesNotMatch(message, /user agent|session/i);
});

test("confirmed AUREON Business number enables publishing", () => {
  assert.equal(SITE_CONFIG.whatsappNumber, "5511926868865");
  assert.equal(isPublishableNumber(SITE_CONFIG.whatsappNumber), true);
});


test("translates the three adaptive build answers into client-friendly Portuguese", () => {
  const message = buildWhatsAppMessage({
    identity:{name:"Bueno Invest"},
    route:"build",
    answers:{
      goal:"sales",
      stage:"process",
      solution:"guidance"
    },
    utm:{source:"ig",content:"link_in_bio"}
  }, {title:"AUREON Start",priceLabel:""});

  assert.match(message, /O que deseja criar: Atendimento ou vendas/);
  assert.match(message, /Etapa atual: Já tenho um processo ou planilha/);
  assert.match(message, /Solução desejada: Preciso de orientação/);
  assert.match(message, /Origem: Instagram \/ Link na bio/);
  assert.doesNotMatch(message, /R\$|investimento|\bgoal:|\bstage:|\bsolution:/i);
});
