import { useState } from 'react';
import { api } from '../lib/api.js';
import { useApp } from '../lib/AppContext.jsx';

const TITULOS = {
  interesse: { titulo: 'Tenho interesse', texto: 'Envie seus dados e um consultor retorna em até 2 horas úteis.' },
  visita: { titulo: 'Agendar visita ou inspeção', texto: 'Informe a data desejada na mensagem. Organizamos a visita ao hangar e a pré-buy inspection.' },
  proposta: { titulo: 'Enviar proposta', texto: 'Sua proposta é encaminhada diretamente ao vendedor, com sigilo.' },
  contato: { titulo: 'Fale com a FlyTrade', texto: 'Responderemos no mesmo dia útil.' },
};

export default function FormularioLead({ tipo = 'interesse', aeronave = null, compacto = false }) {
  const { usuario, notificar } = useApp();
  const [dados, setDados] = useState({
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    telefone: usuario?.telefone || '',
    mensagem: aeronave ? `Olá, tenho interesse no ${aeronave.fabricante} ${aeronave.modelo} ${aeronave.ano}.` : '',
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');

  const cfg = TITULOS[tipo] || TITULOS.interesse;

  async function enviar(evento) {
    evento.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await api.criarLead({ ...dados, tipo, aeronaveId: aeronave?.id });
      setEnviado(true);
      notificar('Solicitação enviada! Em breve entraremos em contato.');
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <div className="mensagem-ok">
        <strong>Recebemos sua solicitação.</strong>
        <p style={{ marginTop: 6 }}>
          Protocolo gerado e enviado para {aeronave ? aeronave.vendedor.nome : 'a equipe FlyTrade'}. Um consultor
          entra em contato pelo telefone informado.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar}>
      {!compacto && (
        <>
          <h3>{cfg.titulo}</h3>
          <p style={{ color: 'var(--cinza-600)', fontSize: '0.92rem', margin: '8px 0 20px' }}>{cfg.texto}</p>
        </>
      )}
      {erro && <div className="mensagem-erro" style={{ marginBottom: 16 }}>{erro}</div>}
      <div className="form-grid">
        <div className="campo">
          <label htmlFor={`nome-${tipo}`}>Nome completo *</label>
          <input id={`nome-${tipo}`} required value={dados.nome} onChange={(e) => setDados({ ...dados, nome: e.target.value })} />
        </div>
        <div className="campo">
          <label htmlFor={`email-${tipo}`}>E-mail *</label>
          <input id={`email-${tipo}`} type="email" required value={dados.email} onChange={(e) => setDados({ ...dados, email: e.target.value })} />
        </div>
        <div className="campo">
          <label htmlFor={`tel-${tipo}`}>Telefone / WhatsApp *</label>
          <input id={`tel-${tipo}`} required placeholder="(11) 90000-0000" value={dados.telefone} onChange={(e) => setDados({ ...dados, telefone: e.target.value })} />
        </div>
        <div className="campo col-cheia">
          <label htmlFor={`msg-${tipo}`}>Mensagem</label>
          <textarea id={`msg-${tipo}`} value={dados.mensagem} onChange={(e) => setDados({ ...dados, mensagem: e.target.value })} />
        </div>
      </div>
      <button className="btn btn--ouro btn--bloco" style={{ marginTop: 18 }} disabled={enviando}>
        {enviando ? 'Enviando...' : cfg.titulo}
      </button>
      <p style={{ fontSize: '0.78rem', color: 'var(--cinza-400)', marginTop: 12, textAlign: 'center' }}>
        Seus dados são usados apenas para esta negociação, conforme a LGPD.
      </p>
    </form>
  );
}
