const BASE = '/api';

function token() {
  try {
    return localStorage.getItem('flytrade:token') || '';
  } catch {
    return '';
  }
}

async function requisicao(caminho, opcoes = {}) {
  const resposta = await fetch(`${BASE}${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
      ...(opcoes.headers || {}),
    },
  });
  const texto = await resposta.text();
  const dados = texto ? JSON.parse(texto) : null;
  if (!resposta.ok) throw new Error(dados?.erro || 'Não foi possível concluir a operação.');
  return dados;
}

export const api = {
  filtros: () => requisicao('/filtros'),
  aeronaves: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined),
    ).toString();
    return requisicao(`/aeronaves${qs ? `?${qs}` : ''}`);
  },
  destaques: () => requisicao('/aeronaves/destaques'),
  aeronave: (id) => requisicao(`/aeronaves/${id}`),
  criarLead: (dados) => requisicao('/leads', { method: 'POST', body: JSON.stringify(dados) }),
  leads: () => requisicao('/leads'),
  criarSolicitacao: (dados) => requisicao('/solicitacoes', { method: 'POST', body: JSON.stringify(dados) }),
  adminResumo: () => requisicao('/admin/resumo'),
  mudarStatus: (id, status, observacao) =>
    requisicao(`/admin/solicitacoes/${id}/status`, { method: 'POST', body: JSON.stringify({ status, observacao }) }),
  publicarSolicitacao: (id) => requisicao(`/admin/solicitacoes/${id}/publicar`, { method: 'POST' }),
  login: (dados) => requisicao('/auth/login', { method: 'POST', body: JSON.stringify(dados) }),
  cadastro: (dados) => requisicao('/auth/cadastro', { method: 'POST', body: JSON.stringify(dados) }),
  eu: () => requisicao('/auth/eu'),
  salvarFavoritos: (favoritos) => requisicao('/favoritos', { method: 'PUT', body: JSON.stringify({ favoritos }) }),
};
