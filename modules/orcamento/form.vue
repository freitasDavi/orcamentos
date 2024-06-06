<template>
    <UCard>
        <template #header>
            <h1 v-if="isEdit" class="text-2xl">Orçamento X</h1>
            <h1 v-else class="text-2xl">Novo orçamento</h1>
        </template>

        <section class="bg-yellow-300">
            <form @submit.prevent="createOrcamento">
                <section class="flex gap-2 items-end">
                    <div class="flex-1">
                        <label for="cliente">Cliente</label>
                        <InputGroup>
                            <Dropdown id="cliente" class="w-full h-8" v-model="cliente" :options="clientes"
                                option-label="nome" option-value="id" />
                            <CadastroCliente />
                        </InputGroup>
                    </div>
                    <Calendar v-model="dataValidade" dateFormat="dd/mm/yy" showIcon class="h-8 flex-1" />
                </section>
                <div>
                    <Button type="submit" class="h-8" label="Salvar" />
                </div>
            </form>
        </section>

        <template #footer>
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
        </template>
    </UCard>
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
    }
})

const createOrcamento = async () => {
    const orcId = await $fetch<string>("https://localhost:7172/api/Orcamentos", {
        method: "POST",
        body: {
            "codigoCliente": cliente.value,
            "validade": dataValidade.value,
            "emissao": new Date(),
            "valorTotal": valorTotal.value
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