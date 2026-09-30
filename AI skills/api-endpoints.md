# API Endpoints and Contracts

## Existing baseline endpoints

### `GET /api/health`

Verifies backend liveness.

Example response:

```json
{"status": "online", "service": "python-backend", "project": "<PROJECT_NAME>"}
```

### `GET /api/ramp-status`

Returns the current boat-ramp status. Implementation: `backend/main.py` → `fetch_ramp_status` in `backend/services/ramp_status.py`.

**Pipeline (cached 300 s):**

1. GET Magog avis importants → `parse_ramp_status_from_html`
2. GET Magog loisirs page → `enrich_river_flow_from_loisirs` (always overwrites `river_flow` when a measurement is found; if flow > 70 m³/s, forces `status=closed`)
3. Serve from in-memory cache until TTL expires

**Query parameters:**

| Name | Type | Effect |
|------|------|--------|
| `mock_flow` | optional int | After a real fetch, overrides `river_flow` / status for UI testing (`> 70` → closed). Not a substitute for scraping. |

**Response model** (`RampStatusResponse`):

| Field | Type | Meaning |
|-------|------|---------|
| `status` | `"open"` \| `"closed"` \| `"unknown"` | Ramp status |
| `label` | string | French UI label (`Ouverte` / `Fermée` / …) |
| `reopening_date` | string \| null | ISO date `YYYY-MM-DD` when closed from avis text |
| `reopening_time` | string \| null | `HH:MM` when present |
| `reopening_date_display` | string \| null | French display date |
| `river_flow` | string \| null | e.g. `"90 m3/s"` |
| `ramp_info` | string \| null | Extra explanation (high flow, seasonal close, …) |
| `source_url` | string | Avis page URL used as primary scrape target |
| `fetched_at` | datetime (ISO) | When this payload was built |
| `excerpt` | string \| null | Ramp-related snippet from avis HTML, if found |

**Errors:** Magog HTTP failures surface as `502` with detail that avis could not be retrieved. A loisirs fetch failure is logged and the avis-only payload is returned.

**Local check:**

```bash
curl -s http://localhost:5000/api/ramp-status | jq .
curl -s 'http://localhost:5000/api/ramp-status?mock_flow=90' | jq .status
```

## Rules for adding endpoints

- Prefix app routes with `/api/...`.
- Return consistent JSON:
  - success: explicit payload (`status`, `data`, `message` as needed),
  - error: `error` or `message` + appropriate HTTP status code.
- Avoid ambiguous routes; name by resource (`/api/users`, `/api/orders/:id`).

## Real-time & AI Streaming (WebSockets)

- For generative AI or high-frequency updates, use **WebSockets** instead of standard HTTP to avoid timeouts.
- Refer to `AI skills/AI_STREAMING_WEBSOCKETS.md` for the mandatory implementation pattern (FastAPI + React 19).

## CORS and frontend API calls

- Keep `CORSMiddleware` configured.
- Local frontend: local backend URL (for example: `http://localhost:5000/api/...`) when no proxy is configured.
- Production frontend: public API URL (for example: `https://api.<project>.blain-projects.ca/api/...`).

## Endpoint checklist (before merge)

- Endpoint is documented via FastAPI OpenAPI (type hints).
- HTTP statuses are consistent.
- Validation is performed using Pydantic models.
- Tests are added in `backend/tests/` using `TestClient`.
- At least one manual check is run via curl/Postman.
