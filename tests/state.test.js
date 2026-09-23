import test from "node:test";
import assert from "node:assert/strict";
import { validateIdentity } from "../js/state.js";

test("a short diagnostic requires only the visitor name before showing the result", () => {
  const result = validateIdentity({ name: "Raphael" });
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test("a blank name is rejected", () => {
  const result = validateIdentity({ name: " " });
  assert.equal(result.valid, false);
  assert.equal(result.errors.name, "Informe seu nome.");
});
