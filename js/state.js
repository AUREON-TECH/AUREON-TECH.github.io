const STORAGE_KEY = "aureon.diagnostic.v1";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

const normalize = (value) => String(value ?? "").trim().replace(/\s+/g, " ");

export function validateIdentity(identity = {}) {
  const errors = {};
  const name = normalize(identity.name);
  const phone = String(identity.phone ?? "").replace(/\D/g, "");
  const email = normalize(identity.email).toLowerCase();
  const city = normalize(identity.city);
  if (name.length < 2) errors.name = "Informe seu nome.";
  if (!/^\d{10,11}$/.test(phone)) errors.phone = "Informe um WhatsApp com DDD.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Informe um e-mail válido.";
  if (!city) errors.city = "Informe sua cidade.";
  if (identity.consent !== true) errors.consent = "Autorize o contato para continuar.";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function readUtm(search = "") {
  const params = new URLSearchParams(search);
  return {
    source: params.get("utm_source") || "",
    medium: params.get("utm_medium") || "",
    campaign: params.get("utm_campaign") || "",
    content: params.get("utm_content") || "",
  };
}

export function createSession(utm = {}) {
  const now = Date.now();
  return {
    id: globalThis.crypto?.randomUUID?.() || `session-${now}`,
    createdAt: now,
    updatedAt: now,
    step: "start",
    identity: {},
    route: "",
    questionIndex: 0,
    answers: {},
    utm: { source: utm.source || "", medium: utm.medium || "", campaign: utm.campaign || "", content: utm.content || "" },
  };
}

export function saveSession(storage, session) {
  storage.setItem(STORAGE_KEY, JSON.stringify({ ...session, updatedAt: Date.now() }));
}

export function loadSession(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || typeof session !== "object" || !Number.isFinite(session.updatedAt) || Date.now() - session.updatedAt > MAX_AGE_MS) {
      storage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    storage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearSession(storage) {
  storage.removeItem(STORAGE_KEY);
}
