<template>
    <h1 
        v-if="token && token.length > 0"
        class="text-3xl font-semibold p-5"    
    >Bem vindo Usuário</h1>
</template>

<script setup lang="ts">

const token = useState<string>('token');

</script>