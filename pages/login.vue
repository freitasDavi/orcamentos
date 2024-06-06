

<template>
    <UContainer>
        <UCard>
            <template #header>
                Login
            </template>
            <UFormGroup label="Email">
                <UInput placeholder="email@mail.com" v-model="email" />
            </UFormGroup>
            <UFormGroup label="Password">
                <UInput placeholder="*****" v-model="password" />
            </UFormGroup>
            <UButton @click="handleLogin">Login</UButton>
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