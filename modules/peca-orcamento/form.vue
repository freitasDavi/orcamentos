<template>
    <div>
        <Button label="Novo" @click="isOpen = true" :disabled="codigoOrcamento.length === 0" />

        <Dialog v-model:visible="isOpen" modal header="Item">
            <div>
                <section class="gridNaoFunciona">
                    <FloatLabel for="peca">
                    <Dropdown id="peca" class="w-full" v-model="form.codigoPeca" :options="pecas"
                                option-label="descricao" option-value="id" @update:model-value="(id: string) => onChangeSelectedPeca(id)" />
                                <label for="peca">Peça</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputText id="nome" placeholder="Nome" v-model="form.nome" />
                        <label for="nome">Nome</label>
                    </FloatLabel>

                    <FloatLabel class="spanL">
                        <Textarea id="descricao" placeholder="Descrição do item" v-model="form.descricao" class="w-full " />
                        <label for="descricao">Descrição</label>
                    </FloatLabel>
                </section>

                

                <Divider align="center" v-if="valores.length > 0" class="mb-10" >Valores</Divider>

                <section class="gridNaoFunciona">
                    <FloatLabel v-for="valor in valores" :key="valor.id" >
                    <InputNumber 
                        v-model="valor.valor"
                        mode="currency"
                        currency="BRL"
                        :id="valor.id"
                        class="w-full mb-4"
                    />
                    <label :for="valor.id">{{ valor.nome }}</label>
                    </FloatLabel>
                    <!-- <UFormGroup v-for="valor in valores" :key="valor.id" :label="valor.nome">
                        <UInput placeholder="00.00" v-model="valor.valor" />
                    </UFormGroup> -->
                </section>

                <Divider align="center" class="mb-10">Totais</Divider>

                <section class="gridNaoFunciona">
                    <FloatLabel>
                        <InputNumber v-model="form.quantidade" id="quantidade" class="w-full" />
                        <label for="quantidade">Quantidade</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputNumber 
                            v-model="form.quantidade" 
                            id="valorTotal" 
                            mode="currency"
                            currency="BRL"
                            class="w-full"
                        />
                        <label for="valorTotal">Valor total</label>
                    </FloatLabel>
                </section>


                <div class="gapNaoFunciona">
                    <Button severity="warning" label="Cancelar" @click="fecharELimparCampos" />
                    <Button :label="form.id.length === 0 ? 'Avançar' : 'Salvar'" @click="insertItemOrcamento" />
                </div>
            </div>
        </Dialog>
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
            toast.add({ detail: "Item adicionado com sucesso", severity: "success", life: 2000 })
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

            toast.add({ detail: "Item salvo", severity: "success", life: 2000 })

            fecharELimparCampos();
        }
    } catch (err) {
        if (err instanceof Error) {
            return toast.add({ summary: "Ops", detail: err.message, severity: "error", life: 5000 })
        }

        toast.add({ summary: "Ops", detail: "Ocorreu um erro, tente novamente", severity: "error", life: 3000 })
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
    margin-top: 20px;
    margin-bottom: 16px;
}

.spanL {
    grid-column: span 2 / span 2;
}

</style>