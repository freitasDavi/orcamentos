export type ItemOrcamento = {
    id?: string,
    nome: string,
    descricao: string,
    quantidade: number,
    valorTotal: number,
    codigoOrcamento: string,
    codigoPeca: string
}

export type Valores = {
    id: string;
    nome: string;
    valor: number;
    codigoItemOrcamento: string;
}