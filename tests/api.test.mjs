import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createBondApi } from '../api/server.mjs';

async function withServer(options, run) {
  const server = createBondApi(options); await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try { await run(`http://127.0.0.1:${server.address().port}`); } finally { await new Promise(resolve => server.close(resolve)); }
}
const config = { apiKey: 'test-key', model: 'test-model', token: 'test-token' };
const request = { mode: 'draft', text: 'Send a useful article', context: { name: 'Maya', goal: 'Product strategy' }, history: [] };
const post = (base, body, token = 'test-token') => fetch(`${base}/v1/coach`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
test('unauthorized and invalid requests never reach the AI provider', async () => {
  await withServer({ ...config, fetchImpl: () => { throw new Error('Must not call provider'); } }, async base => {
    assert.equal((await post(base, request, 'wrong')).status, 401);
    assert.equal((await post(base, { ...request, text: '' })).status, 400);
    assert.equal((await post(base, { ...request, mode: 'send-email' })).status, 400);
    assert.equal((await fetch(`${base}/v1/coach`, { method: 'POST', headers: { Authorization: 'Bearer test-token' }, body: 'x'.repeat(33000) })).status, 413);
  });
});
test('coaching keeps keys server side and extracts Responses output text', async () => {
  await withServer({ ...config, fetchImpl: async (url, options) => {
    assert.equal(url, 'https://api.openai.com/v1/responses');
    const body = JSON.parse(options.body); assert.equal(body.store, false); assert.equal(body.model, 'test-model');
    assert.equal(body.input.at(-1).content, request.text);
    assert.match(body.instructions, /editable outreach/);
    return Response.json({ output: [{ type: 'reasoning', content: [] }, { type: 'message', content: [{ type: 'output_text', text: 'Hi Maya, sharing an article.' }] }] });
  } }, async base => { const response = await post(base, request); assert.equal(response.status, 200); const body = await response.json(); assert.deepEqual(body, { text: 'Hi Maya, sharing an article.' }); });
});
test('provider failure returns actionable errors without leaking credentials', async () => {
  await withServer({ ...config, fetchImpl: async () => Response.json({ error: 'sensitive upstream detail' }, { status: 401 }) }, async base => { const response = await post(base, request); assert.equal(response.status, 502); assert.doesNotMatch(JSON.stringify(await response.json()), /sensitive|test-key/); });
});
test('unconfigured service and blocked browser origins are rejected', async () => {
  await withServer({ apiKey: '', model: '', token: '' }, async base => { assert.equal((await post(base, request)).status, 503); assert.deepEqual(await (await fetch(`${base}/health`)).json(), { ready: false }); assert.equal((await fetch(`${base}/health`, { headers: { Origin: 'https://untrusted.example' } })).status, 403); });
});
