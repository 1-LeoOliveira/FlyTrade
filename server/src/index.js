import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CATEGORIAS, FABRICANTES } from './data/aeronaves.js';
import { getDb, save } from './store.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const uid = (prefixo) => `${prefixo}-${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
const semSenha = ({ senha, ...resto }) => resto;

function usuarioDaRequisicao(req) {
  const token = (req.headers.authorization || '').replace('Bearer ', '').trim();
  if (!token) return null;
  const db = getDb();
  const userId = db.sessoes[token];
  return db.usuarios.find((u) => u.id === userId) || null;
}

function exigeLogin(req, res, next) {
  const usuario = usuarioDaRequisicao(req);
  if (!usuario) return res.status(401).json({ erro: 'Faça login para continuar.' });
  req.usuario = usuario;
  next();
}

function exigeAdmin(req, res, next) {
  exigeLogin(req, res, () => {
    if (req.usuario.papel !== 'admin') return res.status(403).json({ erro: 'Acesso restrito à administração.' });
    next();
  });
}

/* ------------------------------ catálogo ------------------------------ */

app.get('/api/filtros', (_req, res) => {
  const db = getDb();
  const publicadas = db.aeronaves.filter((a) => a.status === 'aprovado');
  res.json({
    categorias: CATEGORIAS,
    fabricantes: [...new Set([...FABRICANTES, ...publicadas.map((a) => a.fabricante)])].sort(),
    localizacoes: [...new Set(publicadas.map((a) => a.localizacao))].sort(),
    anoMin: Math.min(...publicadas.map((a) => a.ano)),
    anoMax: Math.max(...publicadas.map((a) => a.ano)),
    precoMax: Math.max(...publicadas.map((a) => a.preco || 0)),
    total: publicadas.length,
  });
});

app.get('/api/aeronaves', (req, res) => {
  const db = getDb();
  const q = req.query;
  const texto = (q.busca || '').toString().trim().toLowerCase();
  const num = (v) => (v === undefined || v === '' ? null : Number(v));

  let lista = db.aeronaves.filter((a) => a.status === 'aprovado');

  if (q.categoria) {
    const cats = q.categoria.toString().split(',').filter(Boolean);
    lista = lista.filter((a) => cats.includes(a.categoria));
  }
  if (q.fabricante) {
    const fabs = q.fabricante.toString().split(',').filter(Boolean);
    lista = lista.filter((a) => fabs.includes(a.fabricante));
  }
  if (q.localizacao) lista = lista.filter((a) => a.localizacao === q.localizacao);
  if (num(q.anoMin)) lista = lista.filter((a) => a.ano >= num(q.anoMin));
  if (num(q.anoMax)) lista = lista.filter((a) => a.ano <= num(q.anoMax));
  if (num(q.precoMin)) lista = lista.filter((a) => (a.preco ?? Infinity) >= num(q.precoMin));
  if (num(q.precoMax)) lista = lista.filter((a) => (a.preco ?? Infinity) <= num(q.precoMax));
  if (num(q.horasMax)) lista = lista.filter((a) => a.horasTotais <= num(q.horasMax));
  if (num(q.horasMotorMax)) lista = lista.filter((a) => (a.horasMotor ?? 0) <= num(q.horasMotorMax));
  if (num(q.assentosMin)) lista = lista.filter((a) => a.assentos >= num(q.assentosMin));
  if (texto) {
    lista = lista.filter((a) =>
      [a.fabricante, a.modelo, a.categoria, a.localizacao, a.matricula, a.descricao]
        .join(' ')
        .toLowerCase()
        .includes(texto),
    );
  }

  const ordem = q.ordem || 'relevancia';
  const preco = (a) => (a.preco == null ? Number.MAX_SAFE_INTEGER : a.preco);
  const ordenadores = {
    relevancia: (a, b) => Number(b.destaque) - Number(a.destaque) || b.ano - a.ano,
    'preco-asc': (a, b) => preco(a) - preco(b),
    'preco-desc': (a, b) => preco(b) - preco(a),
    'ano-desc': (a, b) => b.ano - a.ano,
    'ano-asc': (a, b) => a.ano - b.ano,
    'horas-asc': (a, b) => a.horasTotais - b.horasTotais,
    recentes: (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm),
  };
  lista = [...lista].sort(ordenadores[ordem] || ordenadores.relevancia);

  res.json({ total: lista.length, itens: lista });
});

app.get('/api/aeronaves/destaques', (_req, res) => {
  const db = getDb();
  res.json(db.aeronaves.filter((a) => a.status === 'aprovado' && a.destaque).slice(0, 6));
});

app.get('/api/aeronaves/:id', (req, res) => {
  const db = getDb();
  const aeronave = db.aeronaves.find((a) => a.id === req.params.id && a.status === 'aprovado');
  if (!aeronave) return res.status(404).json({ erro: 'Aeronave não encontrada.' });

  const similares = db.aeronaves
    .filter((a) => a.status === 'aprovado' && a.id !== aeronave.id)
    .map((a) => {
      let score = 0;
      if (a.categoria === aeronave.categoria) score += 50;
      if (a.fabricante === aeronave.fabricante) score += 15;
      score -= Math.min(20, Math.abs(a.ano - aeronave.ano));
      if (aeronave.preco && a.preco) {
        score -= Math.min(25, (Math.abs(a.preco - aeronave.preco) / aeronave.preco) * 25);
      }
      return { a, score };
    })
    .sort((x, y) => y.score - x.score)
    .slice(0, 3)
    .map((x) => x.a);

  res.json({ aeronave, similares });
});

/* -------------------------------- leads ------------------------------- */

app.post('/api/leads', (req, res) => {
  const { nome, email, telefone, mensagem, aeronaveId, tipo } = req.body || {};
  if (!nome || !email || !telefone) {
    return res.status(400).json({ erro: 'Informe nome, e-mail e telefone.' });
  }
  const db = getDb();
  const aeronave = db.aeronaves.find((a) => a.id === aeronaveId);
  const lead = {
    id: uid('lead'),
    nome,
    email,
    telefone,
    mensagem: mensagem || '',
    tipo: tipo || 'interesse',
    aeronaveId: aeronaveId || null,
    aeronaveNome: aeronave ? `${aeronave.fabricante} ${aeronave.modelo} ${aeronave.ano}` : null,
    vendedor: aeronave ? aeronave.vendedor.nome : 'FlyTrade',
    status: 'novo',
    criadoEm: new Date().toISOString(),
  };
  db.leads.unshift(lead);
  save();
  res.status(201).json({ ok: true, lead });
});

app.get('/api/leads', exigeLogin, (req, res) => {
  const db = getDb();
  if (req.usuario.papel === 'admin') return res.json(db.leads);
  res.json(db.leads.filter((l) => l.email === req.usuario.email));
});

/* ------------------ solicitações de anúncio (vendedores) --------------- */

const STATUS_SOLICITACAO = ['nova', 'em_contato', 'publicada', 'recusada'];

app.post('/api/solicitacoes', (req, res) => {
  const d = req.body || {};
  const obrigatorios = ['fabricante', 'modelo', 'ano', 'categoria', 'contatoNome', 'contatoTelefone'];
  const faltando = obrigatorios.filter((c) => !d[c]);
  if (faltando.length) return res.status(400).json({ erro: `Campos obrigatórios: ${faltando.join(', ')}` });

  const db = getDb();
  const solicitacao = {
    id: uid('sol'),
    protocolo: `FT-${String(db.solicitacoes.length + 1).padStart(4, '0')}`,
    status: 'nova',
    criadoEm: new Date().toISOString(),
    contato: {
      nome: d.contatoNome,
      tipo: d.contatoTipo || 'Proprietário',
      telefone: d.contatoTelefone,
      email: d.contatoEmail || '',
    },
    plano: d.plano || 'basico',
    arquivos: Array.isArray(d.arquivos) ? d.arquivos : [],
    observacoes: [],
    aeronave: {
      categoria: d.categoria,
      fabricante: d.fabricante,
      modelo: d.modelo,
      ano: Number(d.ano),
      preco: d.preco ? Number(d.preco) : null,
      matricula: d.matricula || '—',
      numeroSerie: d.numeroSerie || '—',
      horasTotais: Number(d.horasTotais || 0),
      horasMotor: Number(d.horasMotor || 0),
      tipoHorasMotor: d.tipoHorasMotor || 'TSN',
      horasHelice: d.horasHelice ? Number(d.horasHelice) : null,
      assentos: Number(d.assentos || 4),
      localizacao: d.localizacao || 'A definir',
      aeroporto: d.aeroporto || '—',
      autonomia: Number(d.autonomia || 0),
      velocidadeCruzeiro: Number(d.velocidadeCruzeiro || 0),
      tetoServico: Number(d.tetoServico || 0),
      motores: d.motores || '—',
      avionicos: d.avionicos || '—',
      interior: d.interior || '—',
      pintura: d.pintura || '—',
      manutencao: d.manutencao || '—',
      descricao: d.descricao || '',
    },
  };
  db.solicitacoes.unshift(solicitacao);
  save();
  res.status(201).json({ ok: true, protocolo: solicitacao.protocolo, solicitacao });
});

/* -------------------------------- admin ------------------------------- */

app.get('/api/admin/resumo', exigeAdmin, (_req, res) => {
  const db = getDb();
  res.json({
    solicitacoes: db.solicitacoes,
    novas: db.solicitacoes.filter((s) => s.status === 'nova').length,
    emContato: db.solicitacoes.filter((s) => s.status === 'em_contato').length,
    publicadas: db.aeronaves.filter((a) => a.status === 'aprovado').length,
    anuncios: db.aeronaves,
    leads: db.leads,
  });
});

app.post('/api/admin/solicitacoes/:id/status', exigeAdmin, (req, res) => {
  const { status, observacao } = req.body || {};
  if (!STATUS_SOLICITACAO.includes(status)) return res.status(400).json({ erro: 'Status inválido.' });
  const db = getDb();
  const s = db.solicitacoes.find((x) => x.id === req.params.id);
  if (!s) return res.status(404).json({ erro: 'Solicitação não encontrada.' });
  s.status = status;
  s.atualizadoEm = new Date().toISOString();
  if (observacao) s.observacoes.push({ texto: observacao, em: s.atualizadoEm, por: req.usuario.nome });
  save();
  res.json({ ok: true, solicitacao: s });
});

/** Publica no catálogo a aeronave de uma solicitação já aprovada pelo time. */
app.post('/api/admin/solicitacoes/:id/publicar', exigeAdmin, (req, res) => {
  const db = getDb();
  const s = db.solicitacoes.find((x) => x.id === req.params.id);
  if (!s) return res.status(404).json({ erro: 'Solicitação não encontrada.' });
  if (s.anuncioId) return res.status(409).json({ erro: 'Esta solicitação já foi publicada.' });

  const a = s.aeronave;
  const base = `${a.fabricante}-${a.modelo}-${a.ano}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const anuncio = {
    ...a,
    id: db.aeronaves.some((x) => x.id === base) ? `${base}-${Date.now().toString(36).slice(-4)}` : base,
    pistaMinima: null,
    fotos: [],
    destaque: s.plano === 'premium',
    plano: s.plano,
    vendedor: { nome: s.contato.nome, tipo: s.contato.tipo, telefone: s.contato.telefone },
    status: 'aprovado',
    criadoEm: new Date().toISOString().slice(0, 10),
    solicitacaoId: s.id,
  };
  db.aeronaves.unshift(anuncio);
  s.anuncioId = anuncio.id;
  s.status = 'publicada';
  s.atualizadoEm = new Date().toISOString();
  save();
  res.status(201).json({ ok: true, anuncio });
});

/* --------------------------------- auth ------------------------------- */

app.post('/api/auth/cadastro', (req, res) => {
  const { nome, email, senha, telefone } = req.body || {};
  if (!nome || !email || !senha) return res.status(400).json({ erro: 'Informe nome, e-mail e senha.' });
  const db = getDb();
  if (db.usuarios.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ erro: 'Já existe uma conta com este e-mail.' });
  }
  const usuario = { id: uid('u'), nome, email, senha, telefone: telefone || '', papel: 'cliente', favoritos: [] };
  db.usuarios.push(usuario);
  const token = uid('tk');
  db.sessoes[token] = usuario.id;
  save();
  res.status(201).json({ token, usuario: semSenha(usuario) });
});

app.post('/api/auth/login', (req, res) => {
  const { email, senha } = req.body || {};
  const db = getDb();
  const usuario = db.usuarios.find((u) => u.email.toLowerCase() === (email || '').toLowerCase() && u.senha === senha);
  if (!usuario) return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
  const token = uid('tk');
  db.sessoes[token] = usuario.id;
  save();
  res.json({ token, usuario: semSenha(usuario) });
});

app.get('/api/auth/eu', exigeLogin, (req, res) => res.json({ usuario: semSenha(req.usuario) }));

app.put('/api/favoritos', exigeLogin, (req, res) => {
  const { favoritos } = req.body || {};
  if (!Array.isArray(favoritos)) return res.status(400).json({ erro: 'Lista de favoritos inválida.' });
  req.usuario.favoritos = favoritos;
  save();
  res.json({ ok: true, favoritos });
});

/* ----------------------------- build estático ------------------------- */

const dist = path.join(__dirname, '..', '..', 'client', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`\n  FlyTrade API  →  http://localhost:${PORT}/api\n`);
});
