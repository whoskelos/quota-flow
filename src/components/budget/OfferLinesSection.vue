<script setup>
import { computed, ref } from "vue";
import { useBudgetStore } from "@/stores/useBudgetStore";
import offerCatalog from "@/constants/offerCatalog";
import { formatCurrency } from "@/utils/formatCurrency";
import OfferLineRow from "./OfferLineRow.vue";

const props = defineProps({
  optionIndex: {
    type: Number,
    required: true,
  },
});

const budgetStore = useBudgetStore();

const selectedOffer = ref("");

const option = computed(
  () => budgetStore.formBudget.opciones[props.optionIndex],
);
const totals = computed(() => budgetStore.optionTotals[props.optionIndex]);
const canRemove = computed(() => budgetStore.formBudget.opciones.length > 1);

const handleSelectOffer = () => {
  if (!selectedOffer.value) {
    return;
  }

  const offer = offerCatalog.find((item) => +item.id === +selectedOffer.value);

  budgetStore.addOffer(props.optionIndex, {
    id: offer.id,
    name: offer.name,
    units: 0,
    unitPrice: 0,
  });

  selectedOffer.value = "";
};

const handleRemoveOption = () => {
  budgetStore.removeOption(props.optionIndex);
};
</script>

<template>
  <section class="card">
    <div class="mb-1 flex items-center justify-between gap-3">
      <h2 class="card-h2">
        <span class="card-dot"></span>Opción {{ optionIndex + 1 }}
      </h2>
      <button
        v-if="canRemove"
        type="button"
        class="rounded-[3px] border border-line-strong px-3 py-1.5 text-[.82rem] text-dim hover:border-wine hover:text-wine focus-visible:outline-2 focus-visible:outline-gold"
        @click="handleRemoveOption"
      >
        Quitar opción
      </button>
    </div>
    <p class="hint">
      Añade tantas líneas como pases necesites. Puedes repetir la misma oferta
      con precios distintos.
    </p>

    <ul v-if="optionIndex === 0" class="mb-5 grid gap-2">
      <li
        v-for="item in offerCatalog"
        :key="item.id"
        class="border-l-2 border-line-strong pl-3 text-[.82rem] text-dim"
      >
        <b class="font-semibold text-chalk">{{ item.name }}</b> —
        {{ item.description }}
      </li>
    </ul>

    <div class="mb-5 max-w-sm">
      <label class="lbl" :for="`add-offer-${optionIndex}`">Añadir oferta</label>
      <select
        :id="`add-offer-${optionIndex}`"
        v-model="selectedOffer"
        class="inp"
        @change="handleSelectOffer"
      >
        <option value="">Elige un pase del catálogo…</option>
        <option v-for="item in offerCatalog" :key="item.id" :value="item.id">
          {{ item.name }}
        </option>
      </select>
    </div>

    <OfferLineRow :offers="option.lineas" :option-index="optionIndex" />

    <div class="subline">
      <span>Subtotal de ofertas</span>
      <b>{{ formatCurrency(totals.subtotal) }}</b>
    </div>

    <div class="mt-4 border-t border-line pt-4">
      <div class="max-w-[240px]">
        <label class="lbl" :for="`f-descuento-${optionIndex}`">
          Descuento sobre este subtotal (%)
        </label>
        <input
          :id="`f-descuento-${optionIndex}`"
          v-model="option.descuentoPct"
          type="text"
          class="inp disabled:opacity-50"
          :disabled="totals.isManual"
          inputmode="decimal"
          placeholder="0"
        />
      </div>
      <div class="subline">
        <span>Descuento aplicado</span>
        <b class="!text-wine">−{{ formatCurrency(totals.discount) }}</b>
      </div>
      <div class="subline !mt-2 !border-solid !border-line-strong">
        <span>Subtotal de ofertas con descuento</span>
        <b>{{ formatCurrency(totals.discounted) }}</b>
      </div>
      <p v-if="totals.isManual" class="mt-2 text-[.8rem] text-gold">
        El total manual sustituye al cálculo automático; este descuento no se
        aplica.
      </p>

      <div class="mt-4 max-w-[240px]">
        <label class="lbl" :for="`f-manual-${optionIndex}`">
          Total manual de esta opción (€)
        </label>
        <input
          :id="`f-manual-${optionIndex}`"
          v-model="option.totalManual"
          type="text"
          class="inp"
          inputmode="decimal"
          placeholder="Vacío para calcular automáticamente"
        />
        <p class="mt-2 text-[.8rem] text-dim">
          Si lo rellenas, sustituye al cálculo de esta opción. Las demás siguen
          calculándose solas.
        </p>
      </div>
    </div>
  </section>
</template>
