

<template>
    <UContainer class="w-2/4 h-full flex items-center justify-center">
        <UCard class="w-2/3 ">
            <template #header>
                Login
            </template>
            <section class="flex flex-col gap-6">
                <UFormGroup label="Email">
                    <UInput placeholder="email@mail.com" v-model="email" />
                </UFormGroup>
                <UFormGroup label="Password">
                    <UInput placeholder="*****" v-model="password" type="password" />
                </UFormGroup>
                <div class="w-ful flex justify-end gap-2">
                    <UButton @click="handleLogin" size="md" color="red">Registrar</UButton>
                    <UButton @click="handleLogin" size="md">Login</UButton>
                </div>
            </section>
        </UCard>
    </UContainer>
</template>


<script setup lang="ts">
const email = ref('')
const password = ref('')
const token = useState<string>('token')
const router = useRouter();
const toast = useToast();

type TokenResponse = {
    msg: string
}

const handleLogin = async () => {
    try {
        const data = {
            email: email.value,
            password: password.value
        }
        const response = await $fetch<TokenResponse>('https://localhost:7172/api/Auth/login', {
            method: "POST",
            body: data
        })

        
        toast.add({ title: "Uepa", color: "fuchsia", timeout: 5000, callback: () => handleSuccess(response.msg) })
    } catch (err) {
        console.log(err);
        toast.add({ title: "Uepa", color: "red" })
    }
}

const handleSuccess = (requestToken: string) => {
    token.value = requestToken;
    router.push("/")
}

</script>