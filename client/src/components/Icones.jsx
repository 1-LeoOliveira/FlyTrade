const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const IconeCoracao = ({ preenchido, ...p }) => (
  <svg {...base} {...p} fill={preenchido ? 'currentColor' : 'none'}>
    <path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1l8.8 8.8 8.8-8.8a5 5 0 0 0 0-7.1Z" />
  </svg>
);

export const IconeLocal = (p) => (
  <svg {...base} width="14" height="14" {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

export const IconeAviao = (p) => (
  <svg {...base} {...p}>
    <path d="M17.8 19.8 16 14l-4 3v3l-2 1-1-4-4-1 1-2h3l3-4-5.8-1.8a1 1 0 0 1-.2-1.8l1.4-.8a2 2 0 0 1 1.6-.2L15 7.2l3.4-3.4a2 2 0 0 1 2.8 2.8L17.8 10l1.8 6.8a2 2 0 0 1-.2 1.6l-.8 1.4a1 1 0 0 1-1.8-.2Z" />
  </svg>
);

export const IconeEscudo = (p) => (
  <svg {...base} width="26" height="26" {...p}>
    <path d="M12 2 4 5.5v6c0 5 3.4 9.3 8 10.5 4.6-1.2 8-5.5 8-10.5v-6Z" /><path d="m9 12 2 2 4-4" />
  </svg>
);

export const IconeLupa = (p) => (
  <svg {...base} width="26" height="26" {...p}>
    <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
  </svg>
);

export const IconeDocumento = (p) => (
  <svg {...base} width="26" height="26" {...p}>
    <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7Z" /><path d="M14 2v5h5" /><path d="M9 13h6M9 17h6" />
  </svg>
);

export const IconeMoeda = (p) => (
  <svg {...base} width="26" height="26" {...p}>
    <circle cx="12" cy="12" r="9" /><path d="M12 7v10M9.5 9.5a2.5 2.5 0 0 1 2.5-2h1.5M14.5 14.5a2.5 2.5 0 0 1-2.5 2h-1.5" />
  </svg>
);

export const IconeChave = (p) => (
  <svg {...base} width="26" height="26" {...p}>
    <circle cx="8" cy="15" r="4" /><path d="m11 12 8-8 3 3-2 2-2-2-2 2 2 2-3 3" />
  </svg>
);

export const IconeHelice = (p) => (
  <svg {...base} width="26" height="26" {...p}>
    <circle cx="12" cy="12" r="2.2" /><path d="M12 10V4M12 14v6M10 12H4M14 12h6" />
  </svg>
);

export const IconeUsuario = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);

export const IconeComparar = (p) => (
  <svg {...base} width="16" height="16" {...p}>
    <path d="M4 7h7M4 7l2.5-2.5M4 7l2.5 2.5M20 17h-7M20 17l-2.5-2.5M20 17l-2.5 2.5" />
  </svg>
);

export const IconeMenu = (p) => (
  <svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);

export const IconeZap = (p) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.5 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.5-.6a11 11 0 0 1-4.2-3.9c-.6-.8-1-1.7-1-2.6s.5-1.4.7-1.6c.2-.2.4-.3.6-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4-.1.5l-.3.4-.3.3c-.1.1-.2.3 0 .5a8 8 0 0 0 3.6 3c.3.1.4.1.6-.1l.8-1c.2-.2.3-.2.6-.1l2 .9c.2.1.3.2.4.3 0 .1 0 .5-.2 1Z" />
  </svg>
);

export const IconeSeta = (p) => (
  <svg {...base} width="16" height="16" {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

export const IconeRelogio = (p) => (
  <svg {...base} width="14" height="14" {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
