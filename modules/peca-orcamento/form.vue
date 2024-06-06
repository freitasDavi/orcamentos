<template>
    <div>
        <UButton label="Novo" @click="isOpen = true" :disabled="codigoOrcamento.length === 0" />

        <UModal v-model="isOpen" :prevent-close="true">
            <UCard>
                <template #header>
                    <div class="w-full flex justify-between items-end">
                        <h3 class="text-xl">Item do orçamento</h3>
                        <UButton icon="i-heroicons-x-mark-20-solid" @click="fecharELimparCampos" color="white" />
                    </div>
                </template>

                <section class="gridNaoFunciona">

                    <UFormGroup label="Peça">
                        <USelect v-model="form.codigoPeca" :options="pecas" option-attribute="descricao"
                            value-attribute="id" @change="(id: string) => onChangeSelectedPeca(id)" />
                    </UFormGroup>


                    <UFormGroup label="Nome">
                        <UInput placeholder="Nome" v-model="form.nome" />
                    </UFormGroup>

                    <UFormGroup label="Descricao" class="spanL">
                        <UTextarea placeholder="Desrição do item" v-model="form.descricao" />
                    </UFormGroup>

                    
                </section>

                <UDivider label="Valores" class="mb-4" v-if="valores.length > 0" />

                <section class="gridNaoFunciona">
                    <UFormGroup v-for="valor in valores" :key="valor.id" :label="valor.nome">
                        <UInput placeholder="00.00" v-model="valor.valor" />
                    </UFormGroup>
                </section>

                <UDivider label="Totais" class="mb-4" />

                <section class="gridNaoFunciona">
                    <UFormGroup label="Quantidade">
                        <UInput placeholder="00.00" v-model="form.quantidade" />
                    </UFormGroup>

                    <UFormGroup label="Valor total">
                        <UInput placeholder="00.00" v-model="valorTotal" disabled />
                    </UFormGroup>
                </section>

                

                <template #footer>
                    <div class="gapNaoFunciona">
                        <UButton color="white" label="Cancelar" @click="fecharELimparCampos" />
                        <UButton :label="form.id.length === 0 ? 'Avançar' : 'Salvar'" @click="insertItemOrcamento" />
                    </div>
                </template>
            </UCard>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import type { ItemOrcamento, Valores } from '~/types/ItemOrcamento';
import type { Pecas } from '~/types/Pecas';

const toast = useToast();
const token = useState("token")
const isOpen = ref(false);
const form = reactive({
    id: "",
    nome: "",
    descricao: "",
    quantidade: 0,
    valorTotal: 0,
    codigoOrcamento: "",
    codigoPeca: ""
})

const valores = ref<Valores[]>([])

const pecas = ref<Pecas[]>([]);

const props = defineProps<{
    codigoOrcamento: string,
}>()

const fecharELimparCampos = () => {
    form.id = "";
    form.codigoOrcamento = "";
    form.codigoPeca = "";
    form.descricao = "";
    form.nome = "";
    form.quantidade = 0;
    form.valorTotal = 0;

    emits('update');
    isOpen.value = false;
}

const onChangeSelectedPeca = (codigoPeca: string) => {
    var selectedPeca = pecas.value.find((p) => p.id == codigoPeca);

    if (selectedPeca) {
        form.descricao = selectedPeca.descricao;
        form.nome = selectedPeca.descricao;
    }
}

const insertItemOrcamento = async () => {
    var codigoOrcamento = form.codigoOrcamento ? form.codigoOrcamento : props.codigoOrcamento;

    try {
        if (form.id == "") {
            const valoresret = await $fetch<Valores[]>(`https://localhost:7172/api/Orcamentos/Itens`, {
                method: "POST",
                body: {
                    "nome": form.nome,
                    "descricao": form.descricao,
                    "quantidade": form.quantidade,
                    "valorTotal": form.valorTotal,
                    "codigoOrcamento": codigoOrcamento,
                    "codigoPeca": form.codigoPeca
                }
            })

            valores.value = valoresret;
            form.id = valoresret[0].codigoItemOrcamento;
            toast.add({ title: "Item adicionado com sucesso", color: "fuchsia", timeout: 2000 })
        } else {
            var items = valores.value.map((v) => {
                return {
                    id: v.id,
                    nome: v.nome,
                    valor: v.valor,
                    codigoItemOrcamento: v.codigoItemOrcamento
                }
            });

            await $fetch(`https://localhost:7172/api/Orcamentos/${form.id}/Itens`, {
                method: "PUT",
                body: {
                    itemOrcamento: {
                        "nome": form.nome,
                        "descricao": form.descricao,
                        "quantidade": form.quantidade,
                        "valorTotal": valorTotal.value,
                        "codigoOrcamento": codigoOrcamento,
                        "codigoPeca": form.codigoPeca
                    },
                    valores: items
                }
            })

            toast.add({ title: "Item salvo", color: "fuchsia", timeout: 2000 })

            fecharELimparCampos();
        }
    } catch (err) {
        if (err instanceof Error) {
            return toast.add({ title: "Ops", description: err.message, color: "red", timeout: 5000 })
        }

        toast.add({ title: "Ops", description: "Ocorreu um erro, tente novamente", color: "red", timeout: 3000 })
    }
}

onMounted(async () => {
    const data = await $fetch<Pecas[]>("https://localhost:7172/api/Pecas", {
        headers: {
            "Authorization": "Bearer " + token.value
        }
    });
    pecas.value = data;
})

const editItem = async (data: ItemOrcamento) => {
    form.nome = data.nome;
    form.codigoOrcamento = data.codigoOrcamento;
    form.codigoPeca = data.codigoPeca;
    form.descricao = data.descricao;
    form.quantidade = data.quantidade;
    form.valorTotal = data.valorTotal;
    form.id = data.id!

    const res = await $fetch<Valores[]>(`https://localhost:7172/api/Orcamentos/Itens/${data.id!}/valores`, {
        headers: {
            "Authorization": "Bearer " + token.value
        }
    })

    valores.value = res;
    isOpen.value = true;
}

defineExpose({
    editItem
})

const emits = defineEmits(['update']);

const valorTotal = computed(() => {
    return +form.quantidade * valores.value.reduce((acumulador, vl) => acumulador + +vl.valor, 0)
})

</script>

<style scoped>
.gapNaoFunciona {
    width: 100%;
    display: flex;
    justify-content: end;
    gap: 16px;
    
}

.gridNaoFunciona {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 16px;
}

.spanL {
    grid-column: span 2 / span 2;
}

</style>