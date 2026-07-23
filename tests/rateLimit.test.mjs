import test from "node:test";
import assert from "node:assert/strict";
import { checkRateLimit, _resetRateLimitState } from "../app/api/chat/rateLimit.js";

test("checkRateLimit: limit altındaki normal kullanım engellenmez", () => {
  _resetRateLimitState();
  const now = Date.now();
  for (let i = 0; i < 20; i++) {
    const r = checkRateLimit("1.2.3.4", now + i);
    assert.equal(r.allowed, true, `istek ${i} reddedilmemeliydi`);
  }
});

test("checkRateLimit: limit aşılınca reddeder ve bekleme süresi döner", () => {
  _resetRateLimitState();
  const now = Date.now();
  for (let i = 0; i < 20; i++) checkRateLimit("5.6.7.8", now);
  const blocked = checkRateLimit("5.6.7.8", now + 1000);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds > 0);
});

test("checkRateLimit: farklı IP'ler birbirinin sayacını etkilemez", () => {
  _resetRateLimitState();
  const now = Date.now();
  for (let i = 0; i < 20; i++) checkRateLimit("9.9.9.9", now);
  const otherIp = checkRateLimit("1.1.1.1", now);
  assert.equal(otherIp.allowed, true);
});

test("checkRateLimit: pencere süresi geçince sayaç sıfırlanır", () => {
  _resetRateLimitState();
  const now = Date.now();
  for (let i = 0; i < 20; i++) checkRateLimit("2.2.2.2", now);
  const afterWindow = checkRateLimit("2.2.2.2", now + 5 * 60 * 1000 + 1);
  assert.equal(afterWindow.allowed, true);
});
