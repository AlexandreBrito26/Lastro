import { useMemo, useState } from "react";
import { pct } from "./calc";
import { ITENS, normalizar, parseCSV, type Item } from "./data";

type Props = { itens: Item[]; onChange: (l: Item[]) => void; onUsar: (i: Item) => void };

export default function Produtos({ itens, onChange, onUsar }: Props) {
  const [q, setQ] = useState("");
  const [texto, setTexto] = useState("");
  const [msg, setMsg] = useState("");
  const [cap, setCap] = useState("");

  const capitulos = useMemo(() => [...new Set(itens.map((i) => i.capitulo).filter(Boolean))] as string[], [itens]);

  const visiveis = useMemo(() => {
    const n = normalizar(q);
    return itens.filter((i) => (!cap || i.capitulo === cap) && (!n || normalizar(i.descricao + i.ncm + i.cest).includes(n)));
  }, [q, cap, itens]);

  function importar() {
    const novos = parseCSV(texto);
    if (!novos.length) { setMsg("Nenhuma linha válida. Use descrição;NCM;CEST;MVA;alíquota, uma por linha."); return; }
    onChange(novos);
    setTexto("");
    setMsg(`${novos.length} produtos importados. Eles substituem a lista atual.`);
  }

  function baixar() {
    const linhas = itens.map((i) => [i.descricao, i.ncm, i.cest, String(i.mva).replace(".", ","), String(i.aliquota).replace(".", ","), i.obs ?? "", i.capitulo ?? "", i.pmpf ? "sim" : "", i.semST ? "sim" : ""].join(";"));
    const url = URL.createObjectURL(new Blob(["descricao;ncm;cest;mva;aliquota;obs;capitulo;pmpf;semst\n" + linhas.join("\n")], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = "lastro-produtos.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="card produtos">
      <h2>Tabela de produtos</h2>
      <p className="nota">
        O NCM é o código que identifica o produto na nota fiscal. Cada mercadoria tem o seu, com MVA e alíquota próprias.
        Escolha uma linha para levar os valores direto ao cálculo.
      </p>
      <label htmlFor="filtro">Filtrar por descrição, NCM ou CEST</label>
      <input id="filtro" type="search" className="solo" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ex.: pneus, 4011, cimento" />

      {capitulos.length > 1 && (
        <div className="chips" role="group" aria-label="Capítulo do Anexo VII">
          <button type="button" aria-pressed={!cap} onClick={() => setCap("")}>Todos</button>
          {capitulos.map((c) => (
            <button key={c} type="button" aria-pressed={cap === c} onClick={() => setCap(cap === c ? "" : c)}>{c}</button>
          ))}
        </div>
      )}
      <p className="nota" role="status">{visiveis.length} de {itens.length} produtos</p>

      <div className="rolagem">
        <table>
          <caption className="so-leitor">Produtos com NCM, CEST, MVA e alíquota</caption>
          <thead>
            <tr><th>Produto</th><th>NCM</th><th>CEST</th><th>MVA</th><th>Alíquota</th><th><span className="so-leitor">Ações</span></th></tr>
          </thead>
          <tbody>
            {visiveis.map((i) => (
              <tr key={i.ncm + i.cest + i.descricao}>
                <td>{i.descricao}{i.pmpf && <span className="selo pmpf">PMPF</span>}{i.semST && <span className="selo sem">Sem ST</span>}{i.obs && <small className="obs">{i.obs}</small>}</td><td>{i.ncm}</td><td>{i.cest}</td><td>{pct(i.mva)}</td><td>{pct(i.aliquota)}</td>
                <td className="ac">
                  <button type="button" className="btn p" onClick={() => onUsar(i)}>Calcular</button>
                  <button type="button" className="x" aria-label={`Remover ${i.descricao}`} onClick={() => onChange(itens.filter((x) => x !== i))}>×</button>
                </td>
              </tr>
            ))}
            {!visiveis.length && <tr><td colSpan={6} className="nota">Nenhum produto encontrado.</td></tr>}
          </tbody>
        </table>
      </div>

      <h2 style={{ marginTop: 20 }}>Importar a sua tabela</h2>
      <label htmlFor="csv">Cole uma linha por produto: descrição;NCM;CEST;MVA;alíquota;observação (opcional)</label>
      <textarea id="csv" className="solo" rows={4} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder={"Cerveja;2203.00.00;03.001.00;140;25"} />
      <div className="acoes">
        <button type="button" className="btn p" onClick={importar}>Importar</button>
        <button type="button" className="btn" onClick={baixar}>Baixar CSV</button>
        <button type="button" className="btn" onClick={() => { onChange(ITENS); setMsg("Exemplos restaurados."); }}>Restaurar exemplos</button>
      </div>
      {msg && <p className="nota" role="status">{msg}</p>}
    </section>
  );
}
