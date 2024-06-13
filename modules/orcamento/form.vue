<template>
    <div class="flex flex-col gap-10 bg-white rounded-lg px-24 py-2 mx-10">
        <div class="p-5 bg-green-600">
            <h1 v-if="isEdit" class="text-2xl">Orçamento X</h1>
            <h1 v-else class="text-2xl">Novo orçamento</h1>
        </div>

        <section class="px-5">
            <form @submit.prevent="createOrcamento">
                <section class="flex flex-col gap-2">
                    <div class="flex-1">
                        <label for="cliente">Cliente</label>
                        <InputGroup>
                            <Dropdown id="cliente" class="w-full h-8" v-model="cliente" :options="clientes"
                                option-label="nome" option-value="id" />
                            <CadastroCliente />
                        </InputGroup>
                    </div>
                    <label for="descricao" >Descrição</label>
                    <InputText id="descricao" class="h-8" v-model="descricao" />

                    <label for="dataValidade">Data de Validade</label>
                    <Calendar id="dataValidade" v-model="dataValidade" dateFormat="dd/mm/yy" showIcon class="h-8 flex-1" />

                    <div class="w-1/4 mt-2 flex justify-end">
                        <Button type="submit" class="h-8" size="small" :label="id ? 'Salvar' : 'Avançar'" />
                    </div>
                </section>
            </form>
        </section>

        <section class="px-5">
            <PecaOrcamentoForm :codigo-orcamento="id" ref="modal" v-on:update="refetchItems(id)" />
        
            <DataTable :value="orcItems" table-style="min-witdh: 50rem">
                <Column field="nome" header="Nome"></Column>
                <Column field="quantidade" header="Quantidade"></Column>
                <!-- <Column field="valorUnitario" header="Valor unitário"></Column> -->
                <Column field="valorTotal" header="Valor total"></Column>
                <Column header="Ações">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" @click="onClickEditItem(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </section>
    </div>
</template>

<script setup lang="ts">
import type { GetClientesCombo } from "~/types/Clientes";
import type { Orcamento, PecasOrcamento } from "~/types/GetOrcamento";
import PecaOrcamentoForm from "../peca-orcamento/form.vue";
import CadastroCliente from "../clientes/CadastroModal.vue";

const toast = useToast();

const clientes = ref<GetClientesCombo[]>([])

const id = ref("");
const cliente = ref()
const valorTotal = ref(0)
const dataValidade = ref(new Date())
const descricao = ref('')
const modal = ref<InstanceType<typeof PecaOrcamentoForm> | null>(null)
const orcItems = ref<PecasOrcamento[]>([]);


const props = defineProps<{
    isEdit: Boolean,
    initialValue?: Orcamento 
}>()

onMounted(async () => {
    const data = await $fetch<GetClientesCombo[]>("https://localhost:7172/api/Clientes")
    clientes.value = data

    if (props.isEdit && props.initialValue) {
        id.value = props.initialValue.id;
        cliente.value = props.initialValue.codigoCliente;
        valorTotal.value = props.initialValue.valorTotal;
        dataValidade.value = new Date(props.initialValue.validade);
        descricao.value = props.initialValue.descricao;
    }
})

const createOrcamento = async () => {
    const orcId = await $fetch<string>("https://localhost:7172/api/Orcamentos", {
        method: "POST",
        body: {
            "codigoCliente": cliente.value,
            "validade": dataValidade.value,
            "emissao": new Date(),
            "valorTotal": valorTotal.value,
            "descricao": descricao.value
        }
    })

    id.value = orcId;
    toast.add({ detail: "Orçamento salvo com sucesso", severity: "success", life: 2000})
}

watch(id, async (newId) => {
    refetchItems(newId);
})

const refetchItems = async (id: string) => {
    const items = await $fetch<PecasOrcamento[]>(`https://localhost:7172/api/Orcamentos/${id}/Itens`)

    orcItems.value = items;
}

const onClickEditItem = (row: PecasOrcamento) => {
    console.log(row)
    modal.value?.editItem({
        codigoOrcamento: row.codigoOrcamento,
        codigoPeca: row.codigoPeca,
        descricao: row.descricao,
        nome: row.nome,
        quantidade: row.quantidade,
        valorTotal: row.valorTotal,
        id: row.id
    })
}
</script>

<style scoped>

.flexRow {
    display: flex;
    justify-content: baseline;
    gap: 16px;
    width: 100%;
}

</style>