<template>
    <div class="h-full flex flex-col">
        <div class="h-28 flex justify-center">
            <img src="~/assets/logo.jpg" class="h-full" />
        </div>
        <section class="flex flex-col justify-between h-full py-4">
            <div class="w-full flex flex-col gap-3   justify-center">
                <navbar-link-button icon="pi pi-home" label="Home" route="/" />

                <navbar-link-button icon="pi pi-money-bill" label="Orçamento" route="/orcamento" />

                <navbar-link-button icon="pi pi-sign-in" label="Login" route="/login" />
            </div>

            <Button icon="pi pi-sign-out" severity="danger" label="Logout" outlined @click="onLogout" />
        </section>
    </div>
</template>

<script setup>
import NavbarLinkButton from './ui/NavbarLinkButton.vue';

const router = useRouter();
const token = useState('token')

const onLogout = () => {
    token.value = "";
    router.push("/login")
}
</script>