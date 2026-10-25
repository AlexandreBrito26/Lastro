# Lastro

Simulador de ICMS-ST (MVA) para Minas Gerais, passo a passo.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # produção (pasta dist)
```

Deploy na Vercel: importe o repositório. O preset Vite é detectado sozinho.

## Tabela de produtos
A aba "Tabela de produtos" lista NCM, CEST, MVA e alíquota de cada mercadoria.
Para usar dados reais, monte um CSV a partir da Parte 2 do Anexo VII do RICMS/23 e cole na área de importação:

```
descricao;ncm;cest;mva;aliquota;obs;capitulo;pmpf;semst
Cimento;2523;05.001.00;20;18;Âmbito 5.1: operações internas e UFs com protocolo
```

A coluna `obs` é opcional e aparece como aviso no cálculo. A lista fica salva no navegador e pode ser baixada em CSV.

## Fonte dos dados iniciais
`lastro-produtos.csv` e `src/data.ts` trazem 95 linhas da Parte 2 do Anexo VII do RICMS/23 (14 capítulos, com marcação de PMPF e de inaplicabilidade de ST), consultadas no site da SEF/MG em 24/10/2026, com alíquotas do Anexo I. Podem faltar itens e capítulos. Confira sempre a versão vigente.

## Pendências
- Só o regime por MVA está implementado. PMPF e outras bases ficam para depois.
- As fórmulas estão em `src/calc.ts`, isoladas da interface, prontas para receber testes.
