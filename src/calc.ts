export type Modo = "interna" | "interestadual";

/** Todos os percentuais entram como número em %, ex.: 18 para 18%. */
export interface Entrada {
  produto: number;
  ipi: number;
  frete: number;
  outras: number;
  mva: number;
  aliqInterna: number;
  aliqInter: number;
  modo: Modo;
}

export interface Resultado {
  custos: number;
  aliqOperacao: number;
  mvaAplicada: number;
  baseST: number;
  icmsBase: number;
  icmsProprio: number;
  st: number;
  total: number;
}

export function calcular(e: Entrada): Resultado {
  const ai = e.aliqInterna / 100;
  const aq = e.modo === "interestadual" ? e.aliqInter / 100 : ai;
  const mva = e.mva / 100;
  const custos = e.produto + e.frete + e.outras;
  const mvaAplicada =
    e.modo === "interestadual" && ai < 1 ? ((1 + mva) * (1 - aq)) / (1 - ai) - 1 : mva;
  const baseST = (custos + e.ipi) * (1 + mvaAplicada);
  const icmsBase = baseST * ai;
  const icmsProprio = custos * aq;
  const st = Math.max(0, icmsBase - icmsProprio);
  return { custos, aliqOperacao: aq, mvaAplicada, baseST, icmsBase, icmsProprio, st, total: custos + e.ipi + st };
}

/** Aceita "1.234,56", "1234,56" e "1234.56". */
export function parseBR(s: string): number {
  const t = s.trim();
  if (!t) return 0;
  let n: string;
  if (t.includes(",")) n = t.replace(/\./g, "").replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+$/.test(t)) n = t.replace(/\./g, "");
  else n = t;
  const v = parseFloat(n);
  return Number.isFinite(v) && v >= 0 ? v : 0;
}

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const decimal = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
export const brl = (v: number) => moeda.format(v);
export const pct = (v: number) => `${decimal.format(v)}%`;
