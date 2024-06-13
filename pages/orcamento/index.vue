<template>
    <div class="px-10">
        <NuxtLink to="/orcamento/novo">
            <Button label="Novo" class="mb-4" />
        </NuxtLink>
        <DataTable :value="data" table-style="min-width: 50rem">
            <Column field="descricao" header="Descrição"></Column>
            <Column field="codigoCliente" header="Cliente"></Column>
            <Column field="valorTotal" header="Valor Total"></Column>
            <Column field="validade" header="Validade">
                <template #body="slotProps">
                    <p>{{ format(new Date(slotProps.data.validade), 'P', { locale: ptBR }) }}</p>
                </template>
            </Column>
            <Column field="emissao" header="Emissão">
                <template #body="slotProps">
                    <p>{{ format(new Date(slotProps.data.emissao), 'P', { locale: ptBR }) }}</p>
                </template>
            </Column>
            <Column header="Ações">
                <template #body="slotProps">
                    <NuxtLink :to="`/orcamento/${slotProps.data.id}`">
                        <Button color="gray" variant="ghost" icon="pi pi-pencil" />
                    </NuxtLink>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import { format } from "date-fns"
import { ptBR } from "date-fns/locale";

const isLoading = ref(false)
const data = ref([])

onMounted( async () => {
    isLoading.value = true;
    const res = await $fetch<[]>('https://localhost:7172/api/Orcamentos')

    data.value = res;
    isLoading.value = false;
})

</script>