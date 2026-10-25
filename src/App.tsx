import { useEffect, useMemo, useRef, useState } from "react";
import { brl, calcular, parseBR, pct, type Modo } from "./calc";
import { carregarItens, guardarItens, normalizar, type Item } from "./data";
import Produtos from "./Produtos";

type Form = {
  produto: string; ipi: string; frete: string; outras: string;
  mva: string; aliqInterna: string; aliqInter: string; modo: Modo;
};
type Cenario = { id: number; nome: string; form: Form; st: number };
type Tema = "auto" | "claro" | "escuro";

const BASE: Form = { produto: "", ipi: "", frete: "", outras: "", mva: "", aliqInterna: "18", aliqInter: "12", modo: "interna" };
const DEMO: Form = { ...BASE, produto: "1000", mva: "40" };
const CHAVE = "lastro:cenarios";

function lerCenarios(): Cenario[] {
  try { return JSON.parse(localStorage.getItem(CHAVE) ?? "[]"); } catch { return []; }
}

function Campo(p: { id: string; label: string; valor: string; onChange: (v: string) => void; antes?: string; depois?: string; ajuda?: string }) {
  return (
    <div className="campo">
      <label htmlFor={p.id}>{p.label}</label>
      <div className="in">
        {p.antes && <span aria-hidden>{p.antes}</span>}
        <input id={p.id} inputMode="decimal" placeholder="0" value={p.valor}
          onChange={(e) => p.onChange(e.target.value.replace(/[^\d.,]/g, ""))} />
        {p.depois && <span aria-hidden>{p.depois}</span>}
      </div>
      {p.ajuda && <small>{p.ajuda}</small>}
    </div>
  );
}

export default function App() {
  const [f, setF] = useState<Form>(DEMO);
  const [busca, setBusca] = useState("");
  const [item, setItem] = useState<Item | null>(null);
  const [itens, setItens] = useState<Item[]>(carregarItens);
  const [aba, setAba] = useState<"calculo" | "produtos">("calculo");
  const [cenarios, setCenarios] = useState<Cenario[]>(lerCenarios);
  const [copiado, setCopiado] = useState(false);
  const [tema, setTema] = useState<Tema>("auto");
  const buscaRef = useRef<HTMLInputElement>(null);
  const resultadoRef = useRef<HTMLElement>(null);

  const set = (k: keyof Form) => (v: string) => setF((o) => ({ ...o, [k]: v }));

  const r = useMemo(() => calcular({
    produto: parseBR(f.produto), ipi: parseBR(f.ipi), frete: parseBR(f.frete), outras: parseBR(f.outras),
    mva: parseBR(f.mva), aliqInterna: parseBR(f.aliqInterna), aliqInter: parseBR(f.aliqInter), modo: f.modo,
  }), [f]);

  const achados = useMemo(() => {
    const q = normalizar(busca);
    return itens.filter((i) => !q || normalizar(i.descricao + i.ncm + i.cest).includes(q));
  }, [busca, itens]);

  const avisos: string[] = [];
  if (parseBR(f.produto) === 0) avisos.push("Informe o valor do produto para ver o cálculo.");
  if (!f.mva.trim()) avisos.push("Informe a MVA ou escolha uma mercadoria na lista.");
  if (parseBR(f.aliqInterna) <= 0 || parseBR(f.aliqInterna) >= 100) avisos.push("A alíquota interna deve ficar entre 0 e 100%.");
  if (item?.semST) avisos.push("O Anexo VII indica que o regime de ST não se aplica a esta mercadoria. O valor abaixo é só ilustrativo.");
  if (item?.pmpf) avisos.push("Esta mercadoria tem PMPF como critério primário da base. Este simulador só calcula por MVA, então use o resultado como estimativa.");
  if (item?.obs) avisos.push(item.obs);
  if (r.st === 0 && r.custos > 0 && f.mva.trim()) avisos.push("O ICMS próprio ficou igual ou maior que o ICMS da base, então não há ST a recolher nesta simulação.");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement;
      if (e.key === "/" && alvo.tagName !== "INPUT" && alvo.tagName !== "SELECT") { e.preventDefault(); buscaRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (tema === "auto") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = tema === "claro" ? "light" : "dark";
  }, [tema]);

  useEffect(() => {
    try { localStorage.setItem(CHAVE, JSON.stringify(cenarios)); } catch { /* armazenamento indisponível */ }
  }, [cenarios]);

  function escolher(i: Item) {
    setItem(i);
    setF((o) => ({ ...o, mva: String(i.mva).replace(".", ","), aliqInterna: String(i.aliquota).replace(".", ",") }));
    setBusca("");
  }

  function salvar() {
    const nome = item ? item.descricao.replace(" (exemplo)", "") : "Mercadoria manual";
    setCenarios((c) => [{ id: Date.now(), nome, form: f, st: r.st }, ...c].slice(0, 5));
  }

  async function copiar() {
    const txt = [
      "Simulação ICMS-ST (MG) no Lastro",
      ...(item ? [`Mercadoria: ${item.descricao}, NCM ${item.ncm}`] : []),
      `Operação: ${f.modo}`,
      `Base da ST: ${brl(r.baseST)}`,
      `MVA aplicada: ${pct(r.mvaAplicada * 100)}`,
      `ICMS próprio: ${brl(r.icmsProprio)}`,
      `ICMS-ST: ${brl(r.st)}`,
      `Total da nota: ${brl(r.total)}`,
    ].join("\n");
    try { await navigator.clipboard.writeText(txt); setCopiado(true); setTimeout(() => setCopiado(false), 1600); } catch { /* sem permissão */ }
  }

  const degraus = [
    { k: "Custos e IPI", v: r.custos + parseBR(f.ipi), cor: "var(--c1)", dica: "produto + frete + despesas + IPI" },
    { k: "Base da ST", v: r.baseST, cor: "var(--c2)", dica: `custos e IPI × (1 + ${pct(r.mvaAplicada * 100)})` },
    { k: "ICMS sobre a base", v: r.icmsBase, cor: "var(--c3)", dica: `base × ${pct(parseBR(f.aliqInterna))}` },
    { k: "ICMS próprio", v: r.icmsProprio, cor: "var(--c4)", dica: `custos × ${pct(r.aliqOperacao * 100)}, é abatido` },
    { k: "ICMS-ST", v: r.st, cor: "var(--st)", dica: "ICMS sobre a base − ICMS próprio" },
  ];
  const maior = Math.max(...degraus.map((d) => d.v), 1);

  return (
    <div className="app">
      <header className="topo">
        <div className="marca">
          <img src="/logo.svg" width="44" height="44" alt="" />
          <div>
            <h1>Lastro</h1>
            <p>ICMS-ST de Minas, passo a passo</p>
          </div>
        </div>
        <div className="tema" role="group" aria-label="Tema">
          {(["auto", "claro", "escuro"] as Tema[]).map((t) => (
            <button key={t} type="button" aria-pressed={tema === t} onClick={() => setTema(t)}>{t === "auto" ? "Auto" : t === "claro" ? "Claro" : "Escuro"}</button>
          ))}
        </div>
      </header>

      <nav className="abas" aria-label="Seções">
        <button type="button" aria-pressed={aba === "calculo"} onClick={() => setAba("calculo")}>Calculadora</button>
        <button type="button" aria-pressed={aba === "produtos"} onClick={() => setAba("produtos")}>Tabela de produtos <em>{itens.length}</em></button>
      </nav>
      {aba === "produtos" && (
        <Produtos itens={itens} onChange={(l) => { setItens(l); guardarItens(l); }} onUsar={(i) => { escolher(i); setAba("calculo"); }} />
      )}

      <main className="grade" hidden={aba !== "calculo"}>
        <div className="col">
          <section className="card">
            <h2>1. Mercadoria</h2>
            {item ? (
              <div className="escolhido">
                <div><strong>{item.descricao}</strong><small>NCM {item.ncm}, CEST {item.cest}, MVA {pct(item.mva)}, alíquota {pct(item.aliquota)}</small></div>
                <button type="button" className="btn" onClick={() => setItem(null)}>Trocar</button>
              </div>
            ) : (
              <>
                <label htmlFor="busca">Buscar por descrição, NCM ou CEST <kbd>/</kbd></label>
                <input id="busca" ref={buscaRef} type="search" className="solo" placeholder="Ex.: cimento, 4011, 08.001" value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && achados[0]) escolher(achados[0]); }} />
                <div className="lista">
                  {achados.map((i) => (
                    <button key={i.ncm + i.cest + i.descricao} type="button" className="opcao" onClick={() => escolher(i)}>
                      <span>{i.descricao}<small>NCM {i.ncm}, CEST {i.cest}</small></span>
                      <em>MVA {pct(i.mva)}</em>
                    </button>
                  ))}
                  {!achados.length && <p className="nota">Nada encontrado. Digite a MVA manualmente no passo 2.</p>}
                </div>
                <p className="nota">Dados do Anexo VII (24/10/2026). Confira NCM, CEST e MVA na versão vigente antes de usar.</p>
              </>
            )}
          </section>

          <section className="card">
            <h2>2. Operação</h2>
            <div className="seg" role="group" aria-label="Tipo de operação">
              <button type="button" aria-pressed={f.modo === "interna"} onClick={() => setF((o) => ({ ...o, modo: "interna" }))}>Interna em MG</button>
              <button type="button" aria-pressed={f.modo === "interestadual"} onClick={() => setF((o) => ({ ...o, modo: "interestadual" }))}>Interestadual para MG</button>
            </div>
            <div className="duas">
              <Campo id="produto" label="Valor do produto" antes="R$" valor={f.produto} onChange={set("produto")} />
              <Campo id="ipi" label="IPI" antes="R$" valor={f.ipi} onChange={set("ipi")} />
              <Campo id="frete" label="Frete" antes="R$" valor={f.frete} onChange={set("frete")} />
              <Campo id="outras" label="Seguro e outras despesas" antes="R$" valor={f.outras} onChange={set("outras")} />
              <Campo id="mva" label="MVA original" depois="%" valor={f.mva} onChange={set("mva")} ajuda={item ? "Preenchida pela mercadoria" : "Consulte a Parte 2 do Anexo VII"} />
              <Campo id="ai" label="Alíquota interna de MG" depois="%" valor={f.aliqInterna} onChange={set("aliqInterna")} />
            </div>
            {f.modo === "interestadual" && (
              <div className="campo">
                <label htmlFor="aq">Alíquota interestadual</label>
                <select id="aq" value={f.aliqInter} onChange={(e) => set("aliqInter")(e.target.value)}>
                  <option value="12">12% (Sul e Sudeste, exceto ES)</option>
                  <option value="7">7% (Norte, Nordeste, Centro-Oeste e ES)</option>
                  <option value="4">4% (importados)</option>
                </select>
              </div>
            )}
          </section>

          {cenarios.length > 0 && (
            <section className="card">
              <h2>Cenários salvos</h2>
              <ul className="cen">
                {cenarios.map((c) => (
                  <li key={c.id}>
                    <button type="button" onClick={() => { setF(c.form); setItem(null); }}>
                      <span>{c.nome}<small>{c.form.modo === "interna" ? "Interna" : "Interestadual"}</small></span>
                      <strong>{brl(c.st)}</strong>
                    </button>
                    <button type="button" className="x" aria-label={`Remover ${c.nome}`} onClick={() => setCenarios((l) => l.filter((x) => x.id !== c.id))}>×</button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="col lateral" ref={resultadoRef} id="resultado" aria-live="polite">
          <section className="card recibo">
            <span className="rotulo">ICMS-ST a recolher</span>
            <div className="valor">{brl(r.st)}</div>
            <p className="total">Total da nota {brl(r.total)}</p>
            {item && <p className="mercadoria">{item.descricao}<small>NCM {item.ncm}, CEST {item.cest}</small></p>}

            {avisos.length > 0 && <ul className="avisos">{avisos.map((a) => <li key={a}>{a}</li>)}</ul>}

            <div className="cascata">
              {degraus.map((d) => (
                <div className="degrau" key={d.k} title={d.dica}>
                  <div className="dl"><span>{d.k}</span><strong>{brl(d.v)}</strong></div>
                  <div className="trilho"><i style={{ width: `${(d.v / maior) * 100}%`, background: d.cor }} /></div>
                  <small>{d.dica}</small>
                </div>
              ))}
            </div>

            <div className="acoes">
              <button type="button" className="btn p" onClick={salvar}>Salvar cenário</button>
              <button type="button" className="btn" onClick={copiar}>{copiado ? "Resumo copiado" : "Copiar resumo"}</button>
              <button type="button" className="btn" onClick={() => { setF(BASE); setItem(null); }}>Limpar</button>
            </div>
            <p className="aviso">Simulação educativa. Não substitui o cálculo oficial nem o aplicativo ST/MinasGerais da SEF/MG. Regimes como PMPF não estão incluídos.</p>
          </section>
        </aside>
      </main>

      <div className="doca" hidden={aba !== "calculo"}>
        <div><span>ICMS-ST</span><strong>{brl(r.st)}</strong></div>
        <button type="button" className="btn p" onClick={() => resultadoRef.current?.scrollIntoView({ behavior: "smooth" })}>Ver cálculo</button>
      </div>
    </div>
  );
}
