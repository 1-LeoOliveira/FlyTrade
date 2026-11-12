import FormularioLead from '../components/FormularioLead.jsx';
import { WHATSAPP_FLYTRADE } from '../components/Layout.jsx';
import { whatsappLink } from '../lib/format.js';
import { IconeZap } from '../components/Icones.jsx';

export default function Contato() {
  return (
    <div className="container" style={{ padding: '36px 0 80px' }}>
      <span className="olho">Contato</span>
      <h1 style={{ margin: '14px 0 10px', fontSize: 'clamp(1.9rem, 4vw, 2.8rem)' }}>Fale com a FlyTrade</h1>
      <p className="secao-sub" style={{ marginBottom: 36 }}>
        Comprar, vender, financiar ou tirar uma dúvida técnica: respondemos em até 2 horas úteis.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 36, alignItems: 'start' }}>
        <div className="painel"><FormularioLead tipo="contato" /></div>

        <div style={{ display: 'grid', gap: 18 }}>
          <div className="vantagem">
            <h3>Atendimento</h3>
            <p style={{ marginTop: 10 }}>
              Segunda a sexta, 8h às 20h · Sábado, 9h às 14h<br />
              (11) 99999-0000<br />
              contato@flytrade.com.br
            </p>
            <a className="btn btn--zap" style={{ marginTop: 18 }} href={whatsappLink(WHATSAPP_FLYTRADE, 'Olá! Gostaria de falar com um consultor FlyTrade.')} target="_blank" rel="noreferrer">
              <IconeZap width="18" height="18" /> Chamar no WhatsApp
            </a>
          </div>
          <div className="vantagem">
            <h3>Showroom e hangar</h3>
            <p style={{ marginTop: 10 }}>
              Av. Brigadeiro Faria Lima, 2000 — Itaim Bibi, São Paulo/SP<br />
              Hangar FlyTrade — SBMT Campo de Marte, Hangar 7<br />
              Visitas com agendamento prévio.
            </p>
          </div>
          <div className="vantagem">
            <h3>Imprensa e parcerias</h3>
            <p style={{ marginTop: 10 }}>imprensa@flytrade.com.br · parcerias@flytrade.com.br</p>
          </div>
        </div>
      </div>
    </div>
  );
}
