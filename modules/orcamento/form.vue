<template>    
    <UCard>
            <template #header>
                <h1 v-if="isEdit" class="text-2xl">Orçamento X</h1>
                <h1 v-else class="text-2xl">Novo orçamento</h1>
            </template>

            <section class="w-1/2">
                <form @submit.prevent="createOrcamento">
                   
                  
                    <div class="flexRow items-end">
                        <UFormGroup label="Cliente" class="flex-1">
                            <USelect v-model="cliente" :options="clientes" option-attribute="nome" value-attribute="id" />
                        </UFormGroup>

                        <UFormGroup label="Data de Validade" class="flex-1">
                            <UPopover :popper="{ placement: 'bottom-start' }" class="w-6">
                                <UButton 
                                    icon="i-heroicons-calendar-days"
                                    :label="format(dataValidade, 'd MMM, yyy', { locale: ptBR })" 
                                />
                            
                                <template #panel="{ close }">
                                    <UiDatePicker v-model="dataValidade" @close="close" />
                                </template>
                            </UPopover> 
                        </UFormGroup>

                        <!-- <UFormGroup label="Valor total" class="flex-1">
                            <UInput v-model="valorTotal" />
                        </UFormGroup> -->
                        <UButton type="subit" size="sm" class="h-8">Salvar</UButton>
                    </div>
                    
                </form>
            </section>

            <template #footer>
                <PecaOrcamentoForm :codigo-orcamento="id" ref="modal" v-on:update="refetchItems(id)" />
                <UTable :rows="orcItems" :columns="columns">
                    <template #actions-data="{ row }">
                        <UButton
                            @click="onClickEditItem(row)"
                            color="gray"
                            variant="ghost"
                            icon="i-heroicons-pencil-square-solid"
                        />
                    </template>
                </UTable>
            </template>
        </UCard>
</template>

<script setup lang="ts">
import { format } from "date-fns"
import { ptBR } from "date-fns/locale";
import type { GetClientesCombo } from "~/types/Clientes";
import type { Orcamento, PecasOrcamento } from "~/types/GetOrcamento";
import PecaOrcamentoForm from "../peca-orcamento/form.vue";

const toast = useToast();

const clientes = ref<GetClientesCombo[]>([])

const id = ref("");
const cliente = ref()
const valorTotal = ref(0)
const dataValidade = ref(new Date())
const modal = ref<InstanceType<typeof PecaOrcamentoForm> | null>(null)
const orcItems = ref<PecasOrcamento[]>([]);

const columns = [
    {
        key: 'nome',
        label: 'Nome'
    },
    {
        key: 'quantidade',
        label: 'Quantidade'
    },
    {
        key: 'valorUnitario',
        label: 'Valor unitário'
    },
    {
        key: 'valorTotal',
        label: 'Valor total'
    },
    {
        key: 'actions',
        label: 'Ações'
    }
]

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
    toast.add({ title: "Orçamento salvo com sucesso", color: "fuchsia", timeout: 2000})
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
}

</style>