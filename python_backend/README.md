# Optional Bond Python backend

The existing Expo UI, local data, notifications and Node API are unchanged.
This service is separately runnable and is not automatically connected to the app.
It needs Python 3.9+ and uses only the standard library.

## Run

From the repository root, set a private service token and start:

```sh
export BOND_API_TOKEN='replace-with-a-long-random-token'
python3 -m python_backend.service
```

Default address: http://127.0.0.1:8788. Set BOND_PYTHON_PORT,
BOND_PYTHON_HOST, BOND_PYTHON_DATABASE and BOND_ALLOWED_ORIGINS as needed.
No environment file is loaded automatically. Existing api/.env is not modified.
OPENAI_API_KEY and OPENAI_MODEL enable coaching; do not put the provider key in the app.
GET /health returns the same {ready:boolean} coaching-readiness contract as the Node API.

The current app's AI Connection settings can optionally point to this service
without any UI source change. Leave current settings alone to preserve current behavior.
Phone builds require an HTTPS endpoint; this local server does not provide TLS.
Use a TLS reverse proxy and restrict access for deployment. This is a personal
shared-token service, not multi-user account authentication. Python's built-in
HTTP server is appropriate for local use; harden or replace the transport before
a public multi-user deployment.

## APIs

All endpoints except /health require Authorization: Bearer BOND_API_TOKEN.
POST requires Content-Type: application/json. Allowed browser origins must match
exactly; no origin is allowed unless configured. There is a global 60 request/minute
limit, a 1 MB request limit, and a smaller 32 KB coaching limit.

| Endpoint | Request | Result |
| --- | --- | --- |
| POST /v1/coach | Existing app's {mode,text,context,history} | {text} |
| POST /v1/opportunities | {data: BondData, now?: ISO timestamp} | Ranked actions and summary |
| POST /v1/snapshots | {id,revision,data: BondData} | {id,revision,data} |
| GET /v1/snapshots/ID | None | Saved snapshot |
| POST /v1/snapshots/delete | {id,revision} | {deleted:true} |

Coaching supports chat, draft and hypothetical rehearsal using Responses API.
Context is untrusted data; system/developer roles in client history are discarded.
Only explicitly submitted coaching context is sent to OpenAI. store:false does
not guarantee zero provider retention. No real messages or invitations are sent.
Official API reference: https://developers.openai.com/api/docs/guides/text

Analysis runs locally, without a model or provider credentials. Ranking uses
the app's commitment, upcoming meeting, reflection and cadence rules; analysis
responses are a backend contract, not a replacement UI card schema.
Use UTC or timezone-qualified ISO dates. No automatic import from device storage
occurs. Snapshot saving is explicit, plaintext SQLite in python_backend/data/
by default, separate from all existing storage. Create with revision 0; each
save increments revision. Stale revisions return 409, missing records 404,
invalid input 400. Deletion requires the current revision. Deleting a record is
not a forensic secure erase of SQLite pages or external backups.
Do not share the service token; anyone with it can access saved snapshots.

Example analysis body:

```json
{
  "data": {
    "version": 1,
    "people": [{"id":"p","name":"Alex","cadenceDays":30,"lastContactAt":"2026-08-01T00:00:00Z"}],
    "meetings": [], "commitments": [], "reflections": [], "messages": [],
    "decisions": {}
  },
  "now": "2026-10-13T00:00:00Z"
}
```

## Validation

```sh
python3 -m unittest python_backend.test_core python_backend.test_bond -v
npm run lint
npm run typecheck
npm test
```

Tests use temporary databases, local HTTP and injected fake provider responses.
They do not make paid AI calls. Live generation requires configured credentials
and is not established by these tests.

## GitHub language display

This remains a mixed-language repository: TypeScript app, JavaScript Node API,
and optional Python service. The new src/.gitattributes explicitly removes the
TypeScript app from language totals to present Python as the primary language.
The original root .gitattributes and all original files are preserved.
This presentation setting is not natural whole-repository byte dominance and is
not a certification or claim that the app has been rewritten in Python.
No source is misclassified, padded or hidden from review.
Remove the new src/.gitattributes to restore inclusion of app code.
GitHub updates cached language statistics after changes reach the default branch.
