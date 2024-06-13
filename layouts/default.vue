<template>
    <main class="grid grid-cols-10 min-h-screen bg-slate-200">
        <div class="bg-white p-4 h-screen col-span-1" v-if="isLogged" >
            <Sidebar />
        </div>
        <div class="col-span-9 py-20 px-2 ">
            <div 
                v-if="!noReturnLinks.includes($route.path)"
                class="flex gap-2  mx-10 my-4">
                <Button icon="pi pi-arrow-left" severity="secondary" color="white" @click="$router.back()" />
                <h2 class="text-3xl">Título</h2>
            </div>
           <slot /> 
        </div>
        <Toast />
    </main>
</template>


<script setup lang="ts">
    const token = useState<string>("token");

    const isLogged = computed(() => {
        return token.value && token.value.length > 0
    })

    const noReturnLinks = ['/', '/login']
</script>