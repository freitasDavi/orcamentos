<template>
    <UContainer>
        <NuxtLink to="/orcamento/novo">
            <UButton size="xl">Novo</UButton>
        </NuxtLink>
        <UTable :loading="isLoading" :rows="data" :columns="columns">
            <template #actions-data="{ row }">
                <NuxtLink :to="`/orcamento/${row.id}`">
                    <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square-solid" />
                </NuxtLink>
            </template>
        </UTable>
    </UContainer>
</template>

<script setup lang="ts">

const columns = [{
    key: 'id',
    label: 'Id'
}, {
    key: 'codigoCliente',
    label: 'Código Cliente'
}, {
    key: 'valorTotal',
    label: 'Valor'
}, {
    key: 'validade',
    label: 'Validade'
}, {
    key: 'emissao',
    label: 'Emissão'
}, {
    key: 'actions'
}]

const isLoading = ref(false)
const data = ref([])

onMounted( async () => {
    isLoading.value = true;
    const res = await $fetch<[]>('https://localhost:7172/api/Orcamentos')

    data.value = res;
    isLoading.value = false;
})

</script>