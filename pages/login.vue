

<template>
    <section class="w-full h-full flex items-center justify-center">
        <div class="w-1/3 bg-white p-10 rounded-lg shadow-md">
            <h2 class="text-3xl font-serif text-slate-900 my-4">Lefil - Login</h2>
            <section class="flex flex-col gap-6">
                <FloatLabel>
                    <InputText id="email" v-model="email" class="w-full" />
                    <label for="email">Email</label>
                </FloatLabel>
                <FloatLabel>
                    <Password id="password" v-model="password" class="w-full" panel-class="w-full" input-class="w-full"  :feedback="false" :toggle-mask="true"  />
                    <label for="password">Password</label>
                </FloatLabel>
                <div class="w-ful flex justify-end gap-2">
                    <Button @click="handleLogin" severity="help"  label="Registar" />
                    <Button @click="handleLogin" severity="success"  label="Login" />
                </div>
            </section>
        </div>
    </section>
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

        
        toast.add({
            severity: 'success',
            summary: "Sucesso",
            detail: "Login realizado com sucesso",
            life: 1995
        })

        setTimeout(() => {
            handleSuccess(response.msg)
        }, 2000)
        //toast.add({ title: "Uepa", color: "fuchsia", timeout: 5000, callback: () => handleSuccess(response.msg) })
    } catch (err) {
        console.log(err);
        toast.add({ 
            summary: "Opa",
            detail: "Login ou senha incorretos",
            severity: "error",
            life: 2000
         })
    }
}

const handleSuccess = (requestToken: string) => {
    token.value = requestToken;
    router.push("/")
}

</script>