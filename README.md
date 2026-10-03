# keywanfakhri.com

Persönliche Website von Keywan Fakhri (KeyOne). Statische Website, gehostet auf Cloudflare Pages.

- Texte, Projekte und Kontaktdaten: `cms/content.json` (bearbeitbar über Pages CMS)
- Impressum: `impressum/index.html` · Datenschutz: `datenschutz/index.html`
- Sprachversionen von About, 6M und Prozessatlas: `index.<lang>.html` (ausgeliefert über `functions/_middleware.js`)

Jede Änderung im Branch `main` wird automatisch veröffentlicht.

## Panel (/admin)

`https://keywanfakhri.com/admin/` – Texte bearbeiten, Dateien ändern, Statistik ansehen.

Einmalige Einrichtung in Cloudflare Pages (Projekt `keywanfakhri-site` → Settings):
- Secret `ADMIN_PASSWORD` – Passwort für das Panel
- Secret `GITHUB_TOKEN` – Fine-grained Token nur für dieses Repository, Berechtigung „Contents: Read and write“
- D1-Binding `DB` – Datenbank für die Statistik (Tabelle wird automatisch angelegt)

Statistik: `track.js` → `functions/api/track.js` (anonyme Tageszähler, keine Cookies, keine IP).
