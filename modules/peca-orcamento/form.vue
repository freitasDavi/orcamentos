
<template>
    <div>
        <UButton label="Novo" @click="fecharELimparCampos" />

        <UModal v-model="isOpen" :prevent-close="true">
            <UCard>
                <template #header>
                    <div class="w-full flex justify-end">
                        <UButton 
                        icon="i-heroicons-x-mark-20-solid" 
                        @click="isOpen = false"
                        color="white"
                        />
                    </div>
                </template>

                MEIO

                <template #footer>
                    <div class="gapNaoFunciona">
                        <UButton color="white" label="Cancelar" @click="fecharELimparCampos" />
                        <UButton label="Salvar" />
                    </div>
                </template>
            </UCard>
        </UModal>
    </div>
</template>

<script setup lang="ts">

const isOpen = ref(false);

const fecharELimparCampos = () => {
    // Limpa

    isOpen.value = false;
}


</script>

<style scoped>
.gapNaoFunciona {
    width: 100%;
    display: flex;
    justify-content: end;
    gap: 16px
}

</style>