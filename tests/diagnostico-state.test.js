import test from "node:test";
import assert from "node:assert/strict";
import { validateIdentity, createSession, saveSession, loadSession, clearSession, readUtm } from "../js/state.js";

class MapStorage {
  constructor() { this.data = new Map(); }
  getItem(key) { return this.data.has(key) ? this.data.get(key) : null; }
  setItem(key, value) { this.data.set(key, String(value)); }
  removeItem(key) { this.data.delete(key); }
}

test("requires valid identity and consent", () => {
  const result = validateIdentity({ name:"R", phone:"123", email:"x", city:"", consent:false });
  assert.equal(result.valid, false);
  assert.deepEqual(Object.keys(result.errors).sort(), ["city","consent","email","name","phone"]);
});

test("accepts a valid Brazilian identity", () => {
  assert.equal(validateIdentity({ name:"Ana", phone:"(12) 99999-9999", email:"ana@example.com", city:"Campos do Jordão", consent:true }).valid, true);
});

test("keeps only approved UTM fields", () => {
  assert.deepEqual(readUtm("?utm_source=ig&utm_medium=social&token=x"), { source:"ig", medium:"social", campaign:"", content:"" });
});

test("restores a valid session and discards malformed JSON", () => {
  const storage = new MapStorage();
  const session = createSession({ source:"ig", medium:"social", campaign:"", content:"" });
  saveSession(storage, session);
  assert.equal(loadSession(storage).id, session.id);
  storage.setItem("aureon.diagnostic.v1", "{");
  assert.equal(loadSession(storage), null);
});

test("clears a stored session", () => {
  const storage = new MapStorage();
  saveSession(storage, createSession({}));
  clearSession(storage);
  assert.equal(loadSession(storage), null);
});
