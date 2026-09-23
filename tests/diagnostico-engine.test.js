import test from "node:test";
import assert from "node:assert/strict";
import { getRouteQuestions, getProgress, calculateRecommendation } from "../js/engine.js";

test("each adaptive route asks exactly three questions", () => {
  assert.equal(getRouteQuestions("build").length, 3);
  assert.equal(getRouteQuestions("learn").length, 3);
});

test("progress reaches 100 after three answers", () => {
  assert.equal(getProgress(0, 3), 0);
  assert.equal(getProgress(3, 3), 100);
});

test("build investment maps directly to the matching commercial offer", () => {
  assert.equal(calculateRecommendation("build", { investment: "starter" }).id, "start");
  assert.equal(calculateRecommendation("build", { investment: "pro" }).id, "pro");
  assert.equal(calculateRecommendation("build", { investment: "business" }).id, "business");
  assert.equal(calculateRecommendation("build", { investment: "saas" }).id, "saas");
});

test("learning route always leads to the available Method AUREON checkout", () => {
  for (const builtBefore of ["never", "unfinished", "simple"]) {
    const result = calculateRecommendation("learn", { builtBefore });
    assert.equal(result.id, "learn-entry");
    assert.equal(result.checkoutUrl, "https://pay.kiwify.com.br/NpaNtPV");
  }
});

test("unknown route is rejected", () => {
  assert.throws(() => getRouteQuestions("other"), /caminho/i);
  assert.throws(() => calculateRecommendation("other", {}), /caminho/i);
});
