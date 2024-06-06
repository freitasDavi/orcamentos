<template>
    <main class="grid grid-cols-10 bg-slate-200 w-screen min-h-screen">
        <div class="col-span-1 bg-green-500 p-4">
            <section class="flex flex-col justify-between h-full py-10">
            
            
            <UVerticalNavigation :links="links" :ui="{
                inactive: 'text-white',
                active: 'text-green-500',
                icon: {
                    inactive: 'text-white',
                    active: 'text-green-500'
                }
            }" />
            <Button 
                v-if="token"
                icon="pi pi-sign-out"
                severity="danger"
                label="Logout"
                @click="onLogout"
            />
            </section>
        </div>
        <div class="col-span-9 py-20 px-2">
            <div 
                v-if="!noReturnLinks.includes($route.path)"
                class="flex gap-2 mx-36 mb-10">
                <Button icon="pi pi-arrow-left" severity="secondary" color="white" @click="$router.back()" />
                <h2 class="text-3xl">Título</h2>
            </div>
           <slot /> 
        </div>
        <Toast />
    </main>
</template>


<script setup lang="ts">
    const route = useRoute();
    const router = useRouter();
    const token = useState('token')

    const noReturnLinks = ref(['/', '/login'])

    const links = [{
        label: 'Home',
        icon: 'i-heroicons-home',
        to: '/'
    }, {
        label: 'Login',
        icon: 'i-heroicons-arrow-left-end-on-rectangle',
        to: '/login'
    }, {
        label: 'Orçamento',
        icon: 'i-heroicons-banknotes',
        to: '/orcamento'  
    }]


    const onLogout = () => {
        token.value = "";
        router.push("/login")
    }

</script>