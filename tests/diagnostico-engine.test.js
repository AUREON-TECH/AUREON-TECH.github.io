import test from "node:test";
import assert from "node:assert/strict";
import { getRouteQuestions, getProgress, calculateRecommendation } from "../js/engine.js";

test("each route has nine questions", () => {
  assert.equal(getRouteQuestions("build").length, 9);
  assert.equal(getRouteQuestions("learn").length, 9);
});

test("progress is bounded", () => {
  assert.equal(getProgress(0, 9), 0);
  assert.equal(getProgress(9, 9), 100);
  assert.equal(getProgress(12, 9), 100);
  assert.equal(getProgress(-1, 9), 0);
});

test("simple showcase maps to Start", () => {
  const result = calculateRecommendation("build", {
    goal: "showcase",
    essentials: ["catalog", "whatsapp"],
    investment: "starter",
  });
  assert.equal(result.id, "start");
  assert.equal(result.priceLabel, "R$ 599,99");
});

test("complex requirements never map to Start", () => {
  for (const essential of ["marketplace", "subscriptions", "finance", "advanced-ai", "integrations"]) {
    const result = calculateRecommendation("build", {
      goal: "showcase",
      essentials: [essential],
      investment: "starter",
    });
    assert.notEqual(result.id, "start");
  }

  const saas = calculateRecommendation("build", {
    essentials: ["subscriptions"],
  });
  assert.equal(saas.id, "saas");
  assert.equal(saas.priceLabel, "Sob orçamento");
});

test("beginner maps to entry course", () => {
  const result = calculateRecommendation("learn", {
    level: "beginner",
    objective: "first-app",
  });
  assert.equal(result.id, "learn-entry");
  assert.equal(result.priceLabel, "R$ 59,99");
});

test("unknown route is rejected", () => {
  assert.throws(() => getRouteQuestions("other"), /caminho/i);
  assert.throws(() => calculateRecommendation("other", {}), /caminho/i);
});
