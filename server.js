const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'companies.json');

// ─── Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Helpers ─────────────────────────────────────────────
function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ─── Routes ──────────────────────────────────────────────

// GET all companies
app.get('/api/companies', (req, res) => {
  res.json(readData());
});

// POST create company
app.post('/api/companies', (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Nombre requerido' });
  const trimmed = name.trim();
  const data = readData();
  if (data[trimmed]) return res.status(409).json({ error: 'La empresa ya existe' });
  data[trimmed] = {};
  writeData(data);
  res.status(201).json({ ok: true, name: trimmed });
});

// DELETE company
app.delete('/api/companies/:name', (req, res) => {
  const name = decodeURIComponent(req.params.name);
  const data = readData();
  if (!data[name]) return res.status(404).json({ error: 'Empresa no encontrada' });
  delete data[name];
  writeData(data);
  res.json({ ok: true });
});

// PUT assign/replace module on company
// Body: { module, machine, id, url }
app.put('/api/companies/:name/module', (req, res) => {
  const name = decodeURIComponent(req.params.name);
  const { module, machine, id, url } = req.body;
  if (!module || !machine || !id || !url)
    return res.status(400).json({ error: 'Faltan campos: module, machine, id, url' });
  const data = readData();
  if (!data[name]) return res.status(404).json({ error: 'Empresa no encontrada' });
  const wasReplaced = !!data[name][module];
  data[name][module] = { machine, id, url };
  writeData(data);
  res.json({ ok: true, replaced: wasReplaced });
});

// DELETE remove module from company
app.delete('/api/companies/:name/module/:module', (req, res) => {
  const name   = decodeURIComponent(req.params.name);
  const module = decodeURIComponent(req.params.module);
  const data = readData();
  if (!data[name]) return res.status(404).json({ error: 'Empresa no encontrada' });
  delete data[name][module];
  writeData(data);
  res.json({ ok: true });
});

// ─── Start ───────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Eversys portal running → http://localhost:${PORT}`);
});
