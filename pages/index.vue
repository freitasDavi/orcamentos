<template>
    Token - {{ token }}
    <NuxtLink to="/orcamento">
        <UButton>
            Orçamento
        </UButton>
    </NuxtLink>
    <NuxtLink to="/login">
        <UButton>
            Login
        </UButton>
    </NuxtLink>
</template>

<script setup lang="ts">

const token = useState('token');
const data = ref([]);


</script>