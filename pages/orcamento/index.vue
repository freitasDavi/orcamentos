<template>
    <UContainer>
        <NuxtLink to="/orcamento/novo">
            <UButton size="xl">Novo</UButton>
        </NuxtLink>
        <UTable :loading="isLoading" :rows="data" :columns="columns" />
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
    key: 'outrosGastos',
    label: 'Adicionais'
}, {
    key: 'valorTotal',
    label: 'Valor'
}, {
    key: 'validade',
    label: 'Validade'
}, {
    key: 'emissao',
    label: 'Emissão'
}]

const isLoading = ref(false)
const data = ref([])

onMounted( async () => {
    isLoading.value = true;
    const res = await fetch('https://localhost:7059/api/Orcamentos')

    const value = await res.json();

    data.value = value;
    isLoading.value = false;
})

</script>