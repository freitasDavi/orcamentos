<template>
    <Button icon="pi pi-plus" class="h-8"  size="small" aria-label="Novo cliente" @click="isOpen = true" />
    <Dialog v-model:visible="isOpen" modal>
        <div>
            <div class="w-full flex justify-between items-end">
                <h3 class="text-xl">Novo Cliente</h3>
                <Button icon="pi pi-plus" @click="fecharELimparCampos" />
            </div>
        </div>
    </Dialog>
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