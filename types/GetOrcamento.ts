


export type Orcamento = {
    id: number;
    codigoCliente: number;
    outrosGastos: number;
    validade: Date;
    emissao: Date;
    valorTotal:number;
}


export type PecasOrcamento = {
    nome: string;
    descricao: string;
    porcentagem: number;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
    codigoPeca: number;
    codigoOrcamento: number;
}