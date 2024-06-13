<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';

const { width } = useWindowSize();

const isWitdhEnough = computed(() => {
    return width.value <= 1400
})

defineProps<{
    icon: string,
    label: string,
    route: string
}>()

</script>

<template>
    <NuxtLink :to="route">
        <button class="flex items-baseline gap-2 text-[#00125E] border-[#00125E] border rounded-sm 
            py-2 px-1 xl:px-4
            hover:bg-slate-100 w-full
            text-sm 
    ">
            <i v-if="!isWitdhEnough" :class="icon" ></i>
            <p class="font-semibold">{{ label }}</p>
        </button>
    </NuxtLink>
</template>