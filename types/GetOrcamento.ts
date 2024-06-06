


export type Orcamento = {
    id: string;
    codigoCliente: string;
    validade: Date;
    emissao: Date;
    valorTotal:number;
}


export type PecasOrcamento = {
    id: string;
    nome: string;
    descricao: string;
    porcentagem: number;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
    codigoPeca: string;
    codigoOrcamento: string;
}