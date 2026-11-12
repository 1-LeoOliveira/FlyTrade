import { imagemAeronave, TIPOS_GALERIA } from './aircraftImage.js';

/**
 * Fotos reais das aeronaves (arquivos em /public/aeronaves).
 * Anúncios novos, ainda sem fotos enviadas, caem na ilustração vetorial.
 */
export function galeria(aeronave) {
  if (aeronave?.fotos?.length) return aeronave.fotos;
  return TIPOS_GALERIA.map((t) => imagemAeronave(aeronave, t.id));
}

export const capa = (aeronave) => galeria(aeronave)[0];

const CAPA_CATEGORIA = {
  jato: '/aeronaves/phenom-300e-2021-1.jpg',
  turboelice: '/aeronaves/pc12-ngx-2022-1.jpg',
  pistao: '/aeronaves/cirrus-sr22t-2019-1.jpg',
  helicoptero: '/aeronaves/airbus-h125-2019-1.jpg',
  experimental: '/aeronaves/vans-rv10-2017-1.jpg',
};

export const capaCategoria = (id) =>
  CAPA_CATEGORIA[id] || imagemAeronave({ id, categoria: id, modelo: id }, 'exterior');
