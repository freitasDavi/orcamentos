
<template>
    <div>
        <template v-if="!isFetching">
            <Form :is-edit="true" :initial-value="initialData" />
        </template>
    </div>
</template>

<script setup lang="ts">
import type { Orcamento } from "~/types/GetOrcamento";
import Form from "~/modules/orcamento/form.vue"

const route = useRoute()
const isFetching = ref<boolean>(true);
const initialData = ref<Orcamento>();

onMounted(async () => {
    const data = await $fetch<Promise<Orcamento>>(`https://localhost:7172/api/Orcamentos/${route.params.id}`)

    initialData.value = data;
    isFetching.value = false;
})
</script>