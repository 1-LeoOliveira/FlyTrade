/**
 * Gera as imagens das aeronaves em SVG (vetorial, embutido como data URI).
 * Evita dependência de fotos externas e mantém o visual consistente do catálogo.
 */

const PALETAS = [
  { ceu: ['#0b1f3a', '#17457a', '#7fb4e6'], destaque: '#d4af37' },
  { ceu: ['#0a1b33', '#1d4f86', '#9fd0f2'], destaque: '#5fb0ef' },
  { ceu: ['#101c38', '#2a5d92', '#f0c98a'], destaque: '#d4af37' },
  { ceu: ['#071428', '#123f6e', '#6fa8da'], destaque: '#e2e8f0' },
  { ceu: ['#131f3d', '#35649b', '#ffd9a8'], destaque: '#d4af37' },
];

function hash(texto = '') {
  let h = 0;
  for (let i = 0; i < texto.length; i += 1) h = (h * 31 + texto.charCodeAt(i)) >>> 0;
  return h;
}

const CORPO = '#f7f9fc';
const SOMBRA = '#cdd7e4';
const ESCURO = '#0b1f3a';

/* ------------------------------ silhuetas ------------------------------ */

function jato(cor) {
  return `
    <g>
      <polygon points="195,418 232,252 286,252 312,418" fill="${CORPO}"/>
      <polygon points="160,252 338,240 338,268 160,278" fill="${CORPO}"/>
      <polygon points="470,420 366,566 500,566 568,420" fill="${SOMBRA}"/>
      <polygon points="486,404 396,318 470,318 556,404" fill="#e6ecf4"/>
      <rect x="300" y="372" width="140" height="62" rx="31" fill="#dfe7f1"/>
      <rect x="312" y="380" width="116" height="46" rx="23" fill="${CORPO}"/>
      <ellipse cx="440" cy="403" rx="9" ry="31" fill="${ESCURO}" opacity="0.35"/>
      <path d="M190,404 L856,398 Q962,420 980,436 Q962,452 856,474 L190,468 Q166,436 190,404 Z" fill="${CORPO}"/>
      <path d="M190,440 L856,446 Q962,448 980,436 Q962,452 856,474 L190,468 Z" fill="${SOMBRA}" opacity="0.55"/>
      <path d="M862,406 q58,10 76,26 q-30,8 -84,6 z" fill="${ESCURO}" opacity="0.85"/>
      <g fill="${ESCURO}" opacity="0.75">
        ${Array.from({ length: 9 }, (_, i) => `<circle cx="${430 + i * 46}" cy="432" r="9"/>`).join('')}
      </g>
      <rect x="200" y="432" width="700" height="7" rx="3.5" fill="${cor}" opacity="0.9"/>
    </g>`;
}

function turboelice(cor) {
  return `
    <g>
      <polygon points="205,420 240,246 292,246 318,420" fill="${CORPO}"/>
      <polygon points="168,252 346,244 346,270 168,280" fill="${CORPO}"/>
      <path d="M200,406 L846,400 Q950,420 968,436 Q950,452 846,472 L200,466 Q176,436 200,406 Z" fill="${CORPO}"/>
      <path d="M200,442 L846,448 Q950,450 968,436 Q950,452 846,472 L200,466 Z" fill="${SOMBRA}" opacity="0.5"/>
      <polygon points="300,392 690,384 690,402 300,410" fill="#e6ecf4"/>
      <polygon points="430,466 352,572 486,572 556,466" fill="${SOMBRA}"/>
      <g opacity="0.95">
        <rect x="446" y="400" width="168" height="46" rx="23" fill="${SOMBRA}"/>
        <ellipse cx="620" cy="423" rx="12" ry="84" fill="#ffffff" opacity="0.24"/>
      </g>
      <g>
        <rect x="470" y="366" width="186" height="50" rx="25" fill="#e6ecf4"/>
        <rect x="470" y="392" width="186" height="24" rx="12" fill="${SOMBRA}" opacity="0.55"/>
        <ellipse cx="662" cy="391" rx="14" ry="94" fill="#ffffff" opacity="0.3"/>
        <rect x="646" y="383" width="26" height="16" rx="8" fill="${cor}"/>
      </g>
      <g fill="${ESCURO}" opacity="0.72">
        ${Array.from({ length: 7 }, (_, i) => `<rect x="${410 + i * 52}" y="424" width="20" height="20" rx="6"/>`).join('')}
      </g>
      <path d="M856,408 q52,10 70,26 q-28,8 -78,6 z" fill="${ESCURO}" opacity="0.8"/>
      <rect x="210" y="434" width="650" height="6" rx="3" fill="${cor}" opacity="0.9"/>
    </g>`;
}

function pistao(cor) {
  return `
    <g>
      <polygon points="248,432 282,300 324,300 346,432" fill="${CORPO}"/>
      <polygon points="214,304 366,296 366,320 214,328" fill="${CORPO}"/>
      <polygon points="330,380 720,372 720,392 330,400" fill="${CORPO}"/>
      <polygon points="470,392 452,470 492,470 510,392" fill="${SOMBRA}"/>
      <path d="M240,412 L780,406 Q860,414 878,436 Q860,456 780,468 L240,462 Q218,436 240,412 Z" fill="${CORPO}"/>
      <path d="M240,442 L780,448 Q860,452 878,436 Q860,456 780,468 L240,462 Z" fill="${SOMBRA}" opacity="0.5"/>
      <path d="M560,408 q98,-4 150,10 l0,16 q-90,6 -150,2 z" fill="${ESCURO}" opacity="0.7"/>
      <ellipse cx="884" cy="436" rx="13" ry="104" fill="#ffffff" opacity="0.3"/>
      <rect x="866" y="424" width="28" height="24" rx="10" fill="${cor}"/>
      <g stroke="${SOMBRA}" stroke-width="7" stroke-linecap="round">
        <line x1="412" y1="470" x2="412" y2="520"/><line x1="700" y1="470" x2="700" y2="512"/>
      </g>
      <g fill="${SOMBRA}"><circle cx="412" cy="530" r="16"/><circle cx="700" cy="522" r="13"/></g>
      <rect x="250" y="436" width="600" height="6" rx="3" fill="${cor}" opacity="0.9"/>
    </g>`;
}

function helicoptero(cor) {
  return `
    <g>
      <path d="M560,392 Q700,356 836,390 Q900,410 898,448 Q880,486 760,492 L600,492 Q540,478 534,440 Q532,408 560,392 Z" fill="${CORPO}"/>
      <path d="M560,448 Q700,470 898,448 Q880,486 760,492 L600,492 Q540,478 534,440 Z" fill="${SOMBRA}" opacity="0.5"/>
      <path d="M700,386 Q806,368 870,404 Q834,424 712,420 Z" fill="${ESCURO}" opacity="0.72"/>
      <path d="M590,400 q-44,16 -48,48 q34,8 70,-6 z" fill="${ESCURO}" opacity="0.6"/>
      <polygon points="560,410 240,418 240,452 560,468" fill="${CORPO}"/>
      <polygon points="560,444 240,452 240,418" fill="${SOMBRA}" opacity="0.45"/>
      <polygon points="248,418 196,348 236,344 268,414" fill="${CORPO}"/>
      <polygon points="212,430 170,404 168,462 214,448" fill="${SOMBRA}"/>
      <circle cx="226" cy="436" r="10" fill="${cor}"/>
      <rect x="690" y="330" width="22" height="64" rx="8" fill="${SOMBRA}"/>
      <rect x="300" y="320" width="790" height="12" rx="6" fill="${ESCURO}" opacity="0.55" transform="rotate(-2 700 326)"/>
      <ellipse cx="700" cy="326" rx="400" ry="18" fill="#ffffff" opacity="0.14"/>
      <g stroke="${SOMBRA}" stroke-width="10" stroke-linecap="round" fill="none">
        <path d="M600,492 L582,548"/><path d="M790,492 L800,548"/>
        <path d="M520,552 L900,552"/>
      </g>
      <rect x="546" y="438" width="340" height="7" rx="3.5" fill="${cor}" opacity="0.9"/>
    </g>`;
}

function experimental(cor) {
  return `
    <g>
      <polygon points="270,430 300,322 338,322 356,430" fill="${CORPO}"/>
      <polygon points="238,326 376,318 376,340 238,348" fill="${CORPO}"/>
      <path d="M270,416 L770,410 Q852,418 868,436 Q852,454 770,466 L270,460 Q252,436 270,416 Z" fill="${CORPO}"/>
      <path d="M270,444 L770,450 Q852,452 868,436 Q852,454 770,466 L270,460 Z" fill="${SOMBRA}" opacity="0.5"/>
      <path d="M548,398 q110,-16 170,12 q-6,16 -16,18 q-86,6 -154,0 z" fill="${ESCURO}" opacity="0.72"/>
      <polygon points="430,462 352,556 470,556 536,462" fill="${SOMBRA}"/>
      <polygon points="440,452 760,446 760,462 440,470" fill="${CORPO}" opacity="0.9"/>
      <ellipse cx="874" cy="436" rx="12" ry="98" fill="#ffffff" opacity="0.3"/>
      <rect x="858" y="426" width="26" height="20" rx="9" fill="${cor}"/>
      <rect x="280" y="434" width="570" height="8" rx="4" fill="${cor}" opacity="0.92"/>
    </g>`;
}

const SILHUETAS = { jato, turboelice, pistao, helicoptero, experimental };

/* -------------------------------- cenas -------------------------------- */

function nuvem(x, y, escala, opacidade) {
  return `<g transform="translate(${x} ${y}) scale(${escala})" fill="#ffffff" opacity="${opacidade}">
    <ellipse cx="0" cy="0" rx="120" ry="34"/><ellipse cx="-60" cy="10" rx="80" ry="26"/>
    <ellipse cx="70" cy="12" rx="90" ry="24"/><ellipse cx="10" cy="-22" rx="70" ry="30"/>
  </g>`;
}

function cenaExterior(categoria, paleta, semente) {
  const silhueta = (SILHUETAS[categoria] || jato)(paleta.destaque);
  const deslocamento = semente % 60;
  return `
    <defs>
      <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${paleta.ceu[0]}"/>
        <stop offset="55%" stop-color="${paleta.ceu[1]}"/>
        <stop offset="100%" stop-color="${paleta.ceu[2]}"/>
      </linearGradient>
      <radialGradient id="sol" cx="0.78" cy="0.18" r="0.55">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.75"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="750" fill="url(#ceu)"/>
    <rect width="1200" height="750" fill="url(#sol)"/>
    ${nuvem(180 + deslocamento, 600, 1.5, 0.22)}
    ${nuvem(980 - deslocamento, 650, 1.9, 0.18)}
    ${nuvem(620, 170 + deslocamento, 1.1, 0.12)}
    <g transform="translate(0 ${-10 + (semente % 24)})">${silhueta}</g>
    <ellipse cx="600" cy="660" rx="320" ry="26" fill="${ESCURO}" opacity="0.16"/>`;
}

function cenaCabine(paleta) {
  const poltrona = (x, y, espelhada) => `
    <g transform="translate(${x} ${y}) scale(${espelhada ? -1.3 : 1.3} 1.3)">
      <rect x="0" y="0" width="150" height="34" rx="16" fill="#6b5844"/>
      <rect x="6" y="-96" width="132" height="112" rx="26" fill="#8a7055"/>
      <rect x="20" y="-84" width="104" height="92" rx="20" fill="#a78a69"/>
      <rect x="0" y="34" width="150" height="16" rx="8" fill="#4a3c2e"/>
    </g>`;
  return `
    <defs>
      <linearGradient id="cab" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#18253c"/><stop offset="100%" stop-color="#2f3d52"/>
      </linearGradient>
      <radialGradient id="luz" cx="0.5" cy="0.1" r="0.8">
        <stop offset="0%" stop-color="#ffe9c2" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#ffe9c2" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="750" fill="url(#cab)"/>
    <rect width="1200" height="750" fill="url(#luz)"/>
    <path d="M0,0 L1200,0 L1200,120 Q600,60 0,120 Z" fill="#0f1a2c"/>
    <path d="M0,750 L1200,750 L1200,600 Q600,668 0,600 Z" fill="#101b2d"/>
    <g fill="#bfd6ef" opacity="0.85">
      <ellipse cx="190" cy="250" rx="62" ry="78"/><ellipse cx="430" cy="236" rx="62" ry="80"/>
      <ellipse cx="770" cy="236" rx="62" ry="80"/><ellipse cx="1010" cy="250" rx="62" ry="78"/>
    </g>
    <g fill="#ffffff" opacity="0.2">
      <ellipse cx="190" cy="250" rx="46" ry="60"/><ellipse cx="430" cy="236" rx="46" ry="62"/>
      <ellipse cx="770" cy="236" rx="46" ry="62"/><ellipse cx="1010" cy="250" rx="46" ry="60"/>
    </g>
    ${poltrona(96, 486, false)}${poltrona(1104, 486, true)}
    ${poltrona(352, 556, false)}${poltrona(848, 556, true)}
    <rect x="510" y="516" width="180" height="28" rx="11" fill="#3b2f24"/>
    <rect x="584" y="544" width="32" height="86" rx="9" fill="#2b231b"/>
    <rect x="0" y="360" width="1200" height="6" fill="${paleta.destaque}" opacity="0.5"/>`;
}

function cenaPainel(paleta) {
  const tela = (x, y, w, h) => `
    <g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#07131f"/>
      <rect x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${(h - 12) * 0.5}" fill="#1d6fb8"/>
      <rect x="${x + 6}" y="${y + 6 + (h - 12) * 0.5}" width="${w - 12}" height="${(h - 12) * 0.5}" fill="#6b4a23"/>
      <rect x="${x + 6}" y="${y + 4 + (h - 12) * 0.5}" width="${w - 12}" height="4" fill="#ffffff" opacity="0.8"/>
      <g stroke="#7ef0a2" stroke-width="2" fill="none" opacity="0.9">
        <path d="M${x + 16},${y + h - 22} L${x + w * 0.35},${y + h - 46} L${x + w * 0.6},${y + h - 30} L${x + w - 16},${y + h - 54}"/>
      </g>
    </g>`;
  const mostrador = (cx, cy, r) => `
    <g>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#0d1726" stroke="#415571" stroke-width="3"/>
      <circle cx="${cx}" cy="${cy}" r="${r - 10}" fill="#101d2f"/>
      <line x1="${cx}" y1="${cy}" x2="${cx + r * 0.55}" y2="${cy - r * 0.4}" stroke="${paleta.destaque}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="4" fill="#e6eef8"/>
    </g>`;
  return `
    <defs>
      <linearGradient id="pnl" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#101a2a"/><stop offset="100%" stop-color="#050b14"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="750" fill="url(#pnl)"/>
    <path d="M0,0 L1200,0 L1200,150 Q600,210 0,150 Z" fill="#16233a"/>
    <rect x="70" y="200" width="1060" height="330" rx="26" fill="#18212e"/>
    ${tela(110, 240, 290, 220)}${tela(430, 230, 340, 250)}${tela(800, 240, 290, 220)}
    ${mostrador(170, 500, 34)}${mostrador(260, 500, 34)}${mostrador(940, 500, 34)}${mostrador(1030, 500, 34)}
    <rect x="430" y="500" width="340" height="18" rx="9" fill="#243143"/>
    <g fill="${paleta.destaque}" opacity="0.85">
      ${Array.from({ length: 12 }, (_, i) => `<rect x="${440 + i * 28}" y="548" width="18" height="10" rx="4"/>`).join('')}
    </g>
    <g fill="#0a111c">
      <path d="M300,750 L300,660 Q300,620 360,620 L420,620 Q450,620 450,660 L450,750 Z"/>
      <path d="M750,750 L750,660 Q750,620 810,620 L870,620 Q900,620 900,660 L900,750 Z"/>
    </g>
    <rect x="70" y="560" width="1060" height="8" rx="4" fill="${paleta.destaque}" opacity="0.35"/>`;
}

function cenaDetalhe(categoria, paleta) {
  const asa = categoria === 'helicoptero'
    ? `<g>
         <rect x="120" y="330" width="980" height="26" rx="13" fill="${CORPO}" transform="rotate(-6 600 343)"/>
         <circle cx="600" cy="352" r="58" fill="${SOMBRA}"/>
         <circle cx="600" cy="352" r="30" fill="${ESCURO}" opacity="0.7"/>
         <rect x="560" y="352" width="80" height="300" rx="20" fill="${CORPO}"/>
       </g>`
    : `<g>
         <path d="M80,620 L820,330 L940,330 L320,660 Z" fill="${CORPO}"/>
         <path d="M820,330 L940,330 L980,120 L905,126 Z" fill="${SOMBRA}"/>
         <path d="M840,322 L938,322 L944,300 L846,302 Z" fill="${paleta.destaque}"/>
         <path d="M300,560 L760,380 L790,392 L330,580 Z" fill="${SOMBRA}" opacity="0.6"/>
       </g>`;
  return `
    <defs>
      <linearGradient id="ceu2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${paleta.ceu[0]}"/>
        <stop offset="60%" stop-color="${paleta.ceu[1]}"/>
        <stop offset="100%" stop-color="${paleta.ceu[2]}"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="750" fill="url(#ceu2)"/>
    ${nuvem(260, 690, 2.2, 0.2)}${nuvem(900, 640, 1.6, 0.16)}
    ${asa}`;
}

/* ------------------------------- fachada ------------------------------- */

export const TIPOS_GALERIA = [
  { id: 'exterior', nome: 'Externa' },
  { id: 'detalhe', nome: 'Detalhe' },
  { id: 'cabine', nome: 'Cabine' },
  { id: 'painel', nome: 'Painel' },
];

export function imagemAeronave(aeronave, tipo = 'exterior') {
  const semente = hash(`${aeronave?.id || ''}${aeronave?.modelo || ''}`);
  const paleta = PALETAS[semente % PALETAS.length];
  const categoria = aeronave?.categoria || 'jato';
  let cena;
  if (tipo === 'cabine') cena = cenaCabine(paleta);
  else if (tipo === 'painel') cena = cenaPainel(paleta);
  else if (tipo === 'detalhe') cena = cenaDetalhe(categoria, paleta);
  else cena = cenaExterior(categoria, paleta, semente);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" width="1200" height="750" role="img" aria-label="${(aeronave?.fabricante || '') + ' ' + (aeronave?.modelo || '')}">${cena}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function imagemCategoria(categoriaId) {
  return imagemAeronave({ id: categoriaId, categoria: categoriaId, modelo: categoriaId }, 'exterior');
}
