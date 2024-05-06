<template>
    <main class="grid grid-cols-10 bg-slate-200 w-screen min-h-screen">
        <div class="col-span-1 bg-green-500">
            <UButton>
                Teste
            </UButton>
        </div>
        <div class="col-span-9 py-20 px-2">
            <div class="flex gap-2 mx-36 mb-10">
                <UButton color="white" @click="$router.back()">
                    <UIcon name="i-heroicons-arrow-small-left" />
                </UButton>
                <h2 class="text-3xl">Título</h2>
            </div>
           <slot /> 
        </div>
    </main>
</template>