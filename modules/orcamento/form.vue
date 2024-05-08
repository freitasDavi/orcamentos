<template>
    <UCard>
            <template #header>
                <h1 v-if="isEdit" class="text-2xl">Orçamento X</h1>
                <h1 v-else class="text-2xl">Novo orçamento</h1>
            </template>

            <section>
                <form @submit.prevent="createOrcamento">
                    <UFormGroup label="Cliente">
                        <USelect v-model="cliente" :options="clientes" option-attribute="nome" value-attribute="id" />
                    </UFormGroup>

                    <UPopover :popper="{ placement: 'bottom-start' }">
                        <UButton icon="i-heroicons-calendar-20-solid" :label="format(dataValidade, 'd MMM, yyy', { locale: ptBR })" />
                    
                        <template #panel="{ close }">
                            <UiDatePicker v-model="dataValidade" @close="close" />
                        </template>
                    </UPopover>

                    <UFormGroup label="Outros gastos">
                        <UInput v-model="outrosGastos" />
                    </UFormGroup>


                    <UButton type="subit">Salvar</UButton>
                </form>
            </section>

            <template #footer>
                <PecaOrcamentoForm />
                <UTable :rows="orcItems" :columns="columns">

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
const clientes = ref<GetClientesCombo[]>([])

const id = ref();
const cliente = ref()
const outrosGastos = ref(0)
const dataValidade = ref(new Date())
const orcItems = ref<PecasOrcamento[]>([]);

const columns = [
    {
        key: 'id',
        label: 'id'
    },
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
    }
]

const props = defineProps<{
    isEdit: Boolean,
    initialValue?: Orcamento 
}>()

onMounted(async () => {
    const data = await $fetch<GetClientesCombo[]>("https://localhost:7059/api/Clientes")
    clientes.value = data

    if (props.isEdit && props.initialValue) {
        id.value = props.initialValue.id;
        cliente.value = props.initialValue.codigoCliente;
        outrosGastos.value = props.initialValue.outrosGastos;
        dataValidade.value = props.initialValue.validade;
    }
})

const createOrcamento = async () => {
    console.log("Cliente selecionado ", cliente.value)

    const orcId = await $fetch("https://localhost:7059/api/Orcamentos", {
        method: "POST",
        body: {
            "codigoCliente": cliente.value,
            "validade": dataValidade.value,
            "outrosGastos": outrosGastos.value
        }
    })

    id.value = orcId;
}

watch(id, async (newId) => {
    const items = await $fetch<PecasOrcamento[]>(`https://localhost:7059/api/Orcamentos/Items/${newId}`)

    orcItems.value = items;
})
</script>
