<template>

    <UButton icon="i-ph-plus" @click="isOpen = true" class="h-8 text-white" />
    <UModal v-model="isOpen" :prevent-close="true">
        <UCard>
            <template #header>
                <div class="w-full flex justify-between items-end">
                    <h3 class="text-xl">Novo Cliente</h3>
                    <div class="bg-red-500 h-10 w-10">
                        <UIcon name="i-ph-plus" class="text-white" />
                    </div>
                    <UButton icon="i-heroicons-x-mark-20-solid" @click="fecharELimparCampos" color="white" />
                </div>
            </template>
        </UCard>
    </UModal>
</template>

<script setup lang="ts">
const isOpen = ref(false);

const fecharELimparCampos = () => {
    // form.id = "";
    // form.codigoOrcamento = "";
    // form.codigoPeca = "";
    // form.descricao = "";
    // form.nome = "";
    // form.quantidade = 0;
    // form.valorTotal = 0;

    // emits('update');
    isOpen.value = false;
}

</script>