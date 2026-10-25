import { parseBR } from "./calc";

export interface Item {
  descricao: string;
  ncm: string;
  cest: string;
  mva: number;
  /** Alíquota interna de MG para o produto, em %. */
  aliquota: number;
  /** Observação do Anexo VII sobre âmbito de aplicação ou base de cálculo. */
  obs?: string;
  /** Capítulo do Anexo VII, ex.: "3. Cervejas, refrigerantes e águas". */
  capitulo?: string;
  /** O PMPF é o critério primário da base de cálculo (a MVA só vale quando ele não se aplica). */
  pmpf?: boolean;
  /** O Anexo VII indica inaplicabilidade do regime de ST para a mercadoria. */
  semST?: boolean;
}

/**
 * 95 linhas da Parte 2 do Anexo VII do RICMS/23 (SEF/MG), consultadas em 24/10/2026 (gerado de lastro-produtos.csv),
 * e alíquotas do Anexo I (18% regra geral, 23% cervejas e chopes, 25% cigarros).
 * As regras mudam por decreto: confira a versão vigente antes de usar.
 */
export const ITENS: Item[] = [
  { descricao: "Cerveja em garrafa de vidro retornável (indústria)", ncm: "2203.00.00", cest: "03.021.00", mva: 140, aliquota: 23, obs: "Âmbito 3.1: o PMPF é o critério primário da base (Parte 1 do Anexo VII). A MVA só vale quando ele não se aplica.", capitulo: "3. Cervejas, refrigerantes e águas", pmpf: true },
  { descricao: "Cerveja em garrafa de vidro retornável (atacadista/distribuidor)", ncm: "2203.00.00", cest: "03.021.00", mva: 70, aliquota: 23, obs: "Âmbito 3.1: o PMPF é o critério primário da base (Parte 1 do Anexo VII). A MVA só vale quando ele não se aplica.", capitulo: "3. Cervejas, refrigerantes e águas", pmpf: true },
  { descricao: "Cerveja em lata (indústria)", ncm: "2203.00.00", cest: "03.021.03", mva: 140, aliquota: 23, obs: "Âmbito 3.1: o PMPF é o critério primário da base (Parte 1 do Anexo VII). A MVA só vale quando ele não se aplica.", capitulo: "3. Cervejas, refrigerantes e águas", pmpf: true },
  { descricao: "Cerveja em lata (atacadista/distribuidor)", ncm: "2203.00.00", cest: "03.021.03", mva: 70, aliquota: 23, obs: "Âmbito 3.1: o PMPF é o critério primário da base (Parte 1 do Anexo VII). A MVA só vale quando ele não se aplica.", capitulo: "3. Cervejas, refrigerantes e águas", pmpf: true },
  { descricao: "Chope (indústria)", ncm: "2203.00.00", cest: "03.023.00", mva: 140, aliquota: 23, obs: "Âmbito 3.1: o PMPF é o critério primário da base (Parte 1 do Anexo VII). A MVA só vale quando ele não se aplica.", capitulo: "3. Cervejas, refrigerantes e águas", pmpf: true },
  { descricao: "Chope (atacadista/distribuidor)", ncm: "2203.00.00", cest: "03.023.00", mva: 115, aliquota: 23, obs: "Âmbito 3.1: o PMPF é o critério primário da base (Parte 1 do Anexo VII). A MVA só vale quando ele não se aplica.", capitulo: "3. Cervejas, refrigerantes e águas", pmpf: true },
  { descricao: "Refrigerante em embalagem PET (indústria)", ncm: "2202.10.00 / 2202.99.00", cest: "03.010.01", mva: 140, aliquota: 18, obs: "Âmbito 3.1: o PMPF é o critério primário da base (Parte 1 do Anexo VII). A MVA só vale quando ele não se aplica.", capitulo: "3. Cervejas, refrigerantes e águas", pmpf: true },
  { descricao: "Refrigerante em embalagem PET (atacadista/distribuidor)", ncm: "2202.10.00 / 2202.99.00", cest: "03.010.01", mva: 40, aliquota: 18, obs: "Âmbito 3.1: o PMPF é o critério primário da base (Parte 1 do Anexo VII). A MVA só vale quando ele não se aplica.", capitulo: "3. Cervejas, refrigerantes e águas", pmpf: true },
  { descricao: "Refrigerante em lata (indústria)", ncm: "2202.10.00 / 2202.99.00", cest: "03.010.02", mva: 140, aliquota: 18, obs: "Âmbito 3.1: o PMPF é o critério primário da base (Parte 1 do Anexo VII). A MVA só vale quando ele não se aplica.", capitulo: "3. Cervejas, refrigerantes e águas", pmpf: true },
  { descricao: "Refrigerante em lata (atacadista/distribuidor)", ncm: "2202.10.00 / 2202.99.00", cest: "03.010.02", mva: 40, aliquota: 18, obs: "Âmbito 3.1: o PMPF é o critério primário da base (Parte 1 do Anexo VII). A MVA só vale quando ele não se aplica.", capitulo: "3. Cervejas, refrigerantes e águas", pmpf: true },
  { descricao: "Uísque", ncm: "2208.30", cest: "02.016.00", mva: 61.05, aliquota: 25, obs: "Âmbito 2.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "2. Bebidas alcoólicas" },
  { descricao: "Vodka", ncm: "2208.60.00", cest: "02.018.00", mva: 61.05, aliquota: 25, obs: "Âmbito 2.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "2. Bebidas alcoólicas" },
  { descricao: "Cigarros, charutos e cigarrilhas", ncm: "2402", cest: "04.001.00", mva: 50, aliquota: 25, obs: "Âmbito 4.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "4. Cigarros e fumo" },
  { descricao: "Cimento", ncm: "2523", cest: "05.001.00", mva: 20, aliquota: 18, obs: "Âmbito 5.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "5. Cimentos" },
  { descricao: "Rolamentos", ncm: "8482", cest: "01.049.00", mva: 71.78, aliquota: 18, obs: "Âmbito 1.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "1. Autopeças" },
  { descricao: "Acumuladores elétricos de chumbo (baterias de arranque)", ncm: "8507.10", cest: "01.053.00", mva: 71.78, aliquota: 18, obs: "Âmbito 1.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "1. Autopeças" },
  { descricao: "Filtros de entrada de ar para motores", ncm: "8421.31.00", cest: "01.041.00", mva: 71.78, aliquota: 18, obs: "Âmbito 1.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "1. Autopeças" },
  { descricao: "Limas, alicates, tenazes e pinças manuais", ncm: "8203", cest: "08.008.00", mva: 45, aliquota: 18, obs: "Âmbito 8.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "8. Ferramentas" },
  { descricao: "Chaves de porcas manuais", ncm: "8204", cest: "08.009.00", mva: 45, aliquota: 18, obs: "Âmbito 8.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "8. Ferramentas" },
  { descricao: "Lâmpadas elétricas", ncm: "8539", cest: "09.001.00", mva: 60.03, aliquota: 18, obs: "Âmbito 9.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "9. Lâmpadas" },
  { descricao: "Lâmpadas de LED", ncm: "8539.52.00", cest: "09.005.00", mva: 63.67, aliquota: 18, obs: "Âmbito 9.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "9. Lâmpadas" },
  { descricao: "Cal", ncm: "2522", cest: "10.001.00", mva: 43, aliquota: 18, obs: "Âmbito 10.3: apenas operações internas.", capitulo: "10. Materiais de construção" },
  { descricao: "Argamassas", ncm: "3816.00.1 / 3824.50.00", cest: "10.002.00", mva: 40, aliquota: 18, obs: "Âmbito 10.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "10. Materiais de construção" },
  { descricao: "Tubos e acessórios de plástico para construção", ncm: "3917", cest: "10.006.00", mva: 35, aliquota: 18, obs: "Âmbito 10.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "10. Materiais de construção" },
  { descricao: "Caixa-d’água de plástico", ncm: "3925.10.00", cest: "10.015.00", mva: 45, aliquota: 18, obs: "Âmbito 10.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "10. Materiais de construção" },
  { descricao: "Telhas de concreto", ncm: "6810.19.00", cest: "10.022.00", mva: 50, aliquota: 18, obs: "Âmbito 10.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "10. Materiais de construção" },
  { descricao: "Vergalhões", ncm: "7214.20.00", cest: "10.042.00", mva: 35, aliquota: 18, obs: "Âmbito 10.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "10. Materiais de construção" },
  { descricao: "Parafusos, porcas, arruelas e rebites de ferro ou aço", ncm: "7318", cest: "10.058.00", mva: 50, aliquota: 18, obs: "Âmbito 10.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "10. Materiais de construção" },
  { descricao: "Torneiras e válvulas para canalizações", ncm: "8481", cest: "10.079.00", mva: 40, aliquota: 18, obs: "Âmbito 10.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "10. Materiais de construção" },
  { descricao: "Papel de parede e revestimentos semelhantes", ncm: "4814", cest: "10.021.00", mva: 75, aliquota: 18, obs: "Âmbito 10.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "10. Materiais de construção" },
  { descricao: "Água sanitária, branqueador e alvejantes", ncm: "2828.90.11 / 2828.90.19 / 3206.41.00 / 3402.50.00 / 3808.94.19", cest: "11.001.00", mva: 65, aliquota: 18, obs: "Âmbito 11.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "11. Materiais de limpeza" },
  { descricao: "Sabões e desinfetantes em pó para lavar roupas", ncm: "3401.20.90 / 3808.94.19", cest: "11.002.00", mva: 40.88, aliquota: 18, obs: "Âmbito 11.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "11. Materiais de limpeza" },
  { descricao: "Sabões e desinfetantes líquidos para lavar roupas", ncm: "3401.20.90 / 3808.94.19", cest: "11.003.00", mva: 40.88, aliquota: 18, obs: "Âmbito 11.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "11. Materiais de limpeza" },
  { descricao: "Detergentes em pó, flocos ou grânulos", ncm: "3402.50.00", cest: "11.004.00", mva: 40.88, aliquota: 18, obs: "Âmbito 11.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "11. Materiais de limpeza" },
  { descricao: "Detergentes líquidos, exceto para lavar roupa", ncm: "3402.50.00", cest: "11.005.00", mva: 40.88, aliquota: 18, obs: "Âmbito 11.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "11. Materiais de limpeza" },
  { descricao: "Detergentes líquidos para lavar roupa", ncm: "3402.50.00", cest: "11.006.00", mva: 40.88, aliquota: 18, obs: "Âmbito 11.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "11. Materiais de limpeza" },
  { descricao: "Outros agentes de superfície e preparações para limpeza (até 50 L ou 50 kg)", ncm: "3402", cest: "11.007.00", mva: 40.88, aliquota: 18, obs: "Âmbito 11.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "11. Materiais de limpeza" },
  { descricao: "Amaciante/suavizante", ncm: "3809.91.90", cest: "11.008.00", mva: 35, aliquota: 18, obs: "Âmbito 11.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "11. Materiais de limpeza" },
  { descricao: "Esponjas para limpeza", ncm: "3924.10.00 / 3924.90.00 / 6805.30.10 / 6805.30.90", cest: "11.009.00", mva: 55, aliquota: 18, obs: "Âmbito 11.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "11. Materiais de limpeza" },
  { descricao: "Álcool etílico para limpeza", ncm: "2207 / 2208.90.00", cest: "11.010.00", mva: 35, aliquota: 18, obs: "Âmbito 11.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "11. Materiais de limpeza" },
  { descricao: "Esponjas e palhas de aço de uso doméstico", ncm: "7323.10.00", cest: "11.011.00", mva: 35, aliquota: 18, obs: "Âmbito 11.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "11. Materiais de limpeza" },
  { descricao: "Sacos de lixo de até 100 litros", ncm: "3923.2", cest: "11.012.00", mva: 65, aliquota: 18, obs: "Âmbito 11.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "11. Materiais de limpeza" },
  { descricao: "Transformadores e bobinas de reatância (ver exclusões no Anexo VII)", ncm: "8504", cest: "12.001.00", mva: 50, aliquota: 18, obs: "Âmbito 12.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "12. Materiais elétricos" },
  { descricao: "Aquecedores elétricos de água, chuveiros e resistências", ncm: "8516", cest: "12.002.00", mva: 45, aliquota: 18, obs: "Âmbito 12.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "12. Materiais elétricos" },
  { descricao: "Interruptores, tomadas e conectores até 1.000 V", ncm: "8536", cest: "12.004.00", mva: 40, aliquota: 18, obs: "Âmbito 12.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "12. Materiais elétricos" },
  { descricao: "Fios e cabos elétricos", ncm: "8544 / 7605 / 7614", cest: "12.007.00", mva: 40, aliquota: 18, obs: "Âmbito 12.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "12. Materiais elétricos" },
  { descricao: "Medicamentos de referência (lista positiva)", ncm: "3003 / 3004", cest: "13.001.00", mva: 38.24, aliquota: 18, obs: "Âmbito 13.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "13. Medicamentos" },
  { descricao: "Medicamentos de referência (lista negativa)", ncm: "3003 / 3004", cest: "13.001.01", mva: 33, aliquota: 18, obs: "Âmbito 13.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "13. Medicamentos" },
  { descricao: "Medicamentos de referência (lista neutra)", ncm: "3003 / 3004", cest: "13.001.02", mva: 41.38, aliquota: 18, obs: "Âmbito 13.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "13. Medicamentos" },
  { descricao: "Medicamentos genéricos (lista positiva)", ncm: "3003 / 3004", cest: "13.002.00", mva: 38.24, aliquota: 18, obs: "Âmbito 13.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "13. Medicamentos" },
  { descricao: "Seringas, mesmo com agulhas", ncm: "9018.31", cest: "13.014.00", mva: 41.38, aliquota: 18, obs: "Âmbito 13.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "13. Medicamentos" },
  { descricao: "Luvas cirúrgicas e de procedimento", ncm: "4015.12.00 / 4015.19.00", cest: "13.012.00", mva: 41.38, aliquota: 18, obs: "Âmbito 13.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "13. Medicamentos" },
  { descricao: "Preservativos", ncm: "4014.10.00", cest: "13.013.00", mva: 0, aliquota: 18, obs: "Âmbito 13.3: inaplicabilidade do regime de ST para esta mercadoria.", capitulo: "13. Medicamentos", semST: true },
  { descricao: "Copos de vidro, exceto vitrocerâmica", ncm: "7013.37.00", cest: "14.002.00", mva: 70, aliquota: 18, obs: "Âmbito 14.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "14. Papéis, plásticos e vidros" },
  { descricao: "Utensílios de mesa e cozinha de plástico, não descartáveis", ncm: "3924.10.00", cest: "14.006.00", mva: 50, aliquota: 18, obs: "Âmbito 14.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "14. Papéis, plásticos e vidros" },
  { descricao: "Artefatos de higiene de plástico (exceto para construção)", ncm: "3924", cest: "14.005.00", mva: 52, aliquota: 18, obs: "Âmbito 14.2: apenas operações internas.", capitulo: "14. Papéis, plásticos e vidros" },
  { descricao: "Pneus novos para automóveis de passageiros", ncm: "4011.10.00", cest: "16.001.00", mva: 42, aliquota: 18, obs: "Âmbito 16.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "16. Pneumáticos" },
  { descricao: "Pneus novos para caminhões, ônibus e máquinas", ncm: "4011", cest: "16.002.00", mva: 32, aliquota: 18, obs: "Âmbito 16.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "16. Pneumáticos" },
  { descricao: "Pneus novos para motocicletas", ncm: "4011.40.00", cest: "16.003.00", mva: 60, aliquota: 18, obs: "Âmbito 16.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "16. Pneumáticos" },
  { descricao: "Outros pneus novos", ncm: "4011", cest: "16.004.00", mva: 45, aliquota: 18, obs: "Âmbito 16.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "16. Pneumáticos" },
  { descricao: "Câmaras de ar de borracha", ncm: "4013", cest: "16.008.00", mva: 45, aliquota: 18, obs: "Âmbito 16.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "16. Pneumáticos" },
  { descricao: "Pneus recauchutados", ncm: "4012.1", cest: "16.006.00", mva: 30, aliquota: 18, obs: "Âmbito 16.3: apenas operações internas.", capitulo: "16. Pneumáticos" },
  { descricao: "Chocolate branco, embalagem de até 1 kg", ncm: "1704.90.10", cest: "17.001.00", mva: 77.88, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Chocolates em tabletes ou barras, não recheados, até 2 kg", ncm: "1806.32.10", cest: "17.003.00", mva: 69.94, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Chocolates e preparações com cacau, embalagem de até 1 kg", ncm: "1806.90.00", cest: "17.004.00", mva: 40, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Achocolatados em pó, embalagem de até 1 kg", ncm: "1806.90.00", cest: "17.006.00", mva: 25, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Sucos de frutas ou de produtos hortícolas", ncm: "2009", cest: "17.010.00", mva: 40, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Água de coco", ncm: "2009.89.2", cest: "17.011.00", mva: 40, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Leite em pó, blocos ou grânulos", ncm: "0402.1 / 0402.2 / 0402.9", cest: "17.012.00", mva: 17, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Leite longa vida (UHT), recipiente de até 2 litros", ncm: "0401.10.10 / 0401.20.10", cest: "17.016.00", mva: 15, aliquota: 18, obs: "Âmbito 17.3: apenas operações internas.", capitulo: "17. Alimentos" },
  { descricao: "Leite em recipiente de até 1 litro", ncm: "0401.40.10 / 0401.50.10", cest: "17.017.00", mva: 15, aliquota: 18, obs: "Âmbito 17.3: apenas operações internas.", capitulo: "17. Alimentos" },
  { descricao: "Iogurte e leite fermentado, recipiente de até 2 litros", ncm: "0403", cest: "17.021.00", mva: 30, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Requeijão e similares, recipiente de até 1 kg", ncm: "0406", cest: "17.023.00", mva: 35, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Queijo muçarela", ncm: "0406.10.10", cest: "17.024.01", mva: 38, aliquota: 18, obs: "Âmbito 17.3: apenas operações internas.", capitulo: "17. Alimentos" },
  { descricao: "Queijos em geral (exceto os com CEST próprio)", ncm: "0406", cest: "17.024.00", mva: 45, aliquota: 18, obs: "Âmbito 17.3: apenas operações internas.", capitulo: "17. Alimentos" },
  { descricao: "Manteiga, embalagem de até 1 kg", ncm: "0405.10.00", cest: "17.025.00", mva: 35, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Margarina e creme vegetal, até 500 g", ncm: "1517.10.00", cest: "17.026.00", mva: 30, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Salgadinhos diversos", ncm: "1905.90.90", cest: "17.031.00", mva: 50, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Catchup, embalagem de até 650 g", ncm: "2103.20.10", cest: "17.034.00", mva: 55, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Maionese, embalagem de até 650 g", ncm: "2103.90.11", cest: "17.039.00", mva: 28, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Tomates preparados ou conservados, até 1 kg", ncm: "2002", cest: "17.040.00", mva: 40, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Massas alimentícias tipo instantânea", ncm: "1902.30.00", cest: "17.047.00", mva: 35, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Pães industrializados (exceto panetones e bolo de forma)", ncm: "1905.20", cest: "17.050.00", mva: 25, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Biscoitos cream cracker e água e sal (derivados de trigo)", ncm: "1905.31.00", cest: "17.053.02", mva: 25, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Óleo de soja refinado, até 5 litros", ncm: "1507.90.11", cest: "17.065.00", mva: 15, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Óleo de girassol, até 5 litros", ncm: "1512.19.11", cest: "17.069.00", mva: 25, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Salsicha e linguiça", ncm: "1601.00.00", cest: "17.077.00", mva: 35, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Mortadela", ncm: "1601.00.00", cest: "17.078.00", mva: 35, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Carne bovina, ovina e bufalina fresca, refrigerada ou congelada", ncm: "0201 / 0202 / 0204 / 0206", cest: "17.084.00", mva: 15, aliquota: 18, obs: "Âmbito 17.3: apenas operações internas.", capitulo: "17. Alimentos" },
  { descricao: "Carnes de aves frescas, refrigeradas, congeladas ou salgadas", ncm: "0207 / 0209 / 0210.99.00 / 1501", cest: "17.087.00", mva: 15, aliquota: 18, obs: "Âmbito 17.3: apenas operações internas.", capitulo: "17. Alimentos" },
  { descricao: "Açúcar refinado, embalagem de até 2 kg", ncm: "1701.1 / 1701.99.00", cest: "17.099.00", mva: 10, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Chá, mesmo aromatizado", ncm: "0902 / 1211.90.90 / 2106.90.90", cest: "17.097.00", mva: 40, aliquota: 18, obs: "Âmbito 17.1: operações internas e UFs com protocolo (lista no Anexo VII).", capitulo: "17. Alimentos" },
  { descricao: "Café torrado e moído, embalagem de até 2 kg", ncm: "0901", cest: "17.096.00", mva: 0, aliquota: 18, obs: "Âmbito 17.4: inaplicabilidade do regime de ST para esta mercadoria.", capitulo: "17. Alimentos", semST: true },
  { descricao: "Farinha de trigo comum, embalagem de até 1 kg", ncm: "1101.00.10", cest: "17.044.11", mva: 0, aliquota: 18, obs: "Âmbito 17.4: inaplicabilidade do regime de ST para esta mercadoria.", capitulo: "17. Alimentos", semST: true },
  { descricao: "Pão francês de até 200 g", ncm: "1905.90.90", cest: "17.062.03", mva: 0, aliquota: 18, obs: "Âmbito 17.4: inaplicabilidade do regime de ST para esta mercadoria.", capitulo: "17. Alimentos", semST: true },
];

export const normalizar = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");

/** Formato por linha: descrição;NCM;CEST;MVA;alíquota. O cabeçalho é opcional. */
export function parseCSV(texto: string): Item[] {
  const saida: Item[] = [];
  for (const linha of texto.split(/\r?\n/)) {
    const t = linha.trim();
    if (!t) continue;
    const sep = t.includes(";") ? ";" : ",";
    const c = t.split(sep).map((x) => x.trim().replace(/^"|"$/g, ""));
    if (c.length < 4 || normalizar(c[0]).startsWith("descricao")) continue;
    saida.push({ descricao: c[0], ncm: c[1], cest: c[2], mva: parseBR(c[3]), aliquota: c[4] ? parseBR(c[4]) : 18, obs: c[5] || undefined, capitulo: c[6] || undefined, pmpf: normalizar(c[7] ?? "") === "sim" || undefined, semST: normalizar(c[8] ?? "") === "sim" || undefined });
  }
  return saida;
}

const CHAVE = "lastro:itens:v3";

export function carregarItens(): Item[] {
  try {
    const l = JSON.parse(localStorage.getItem(CHAVE) ?? "null");
    if (Array.isArray(l) && l.length) return l as Item[];
  } catch { /* usa os exemplos */ }
  return ITENS;
}

export function guardarItens(l: Item[]) {
  try { localStorage.setItem(CHAVE, JSON.stringify(l)); } catch { /* armazenamento indisponível */ }
}
