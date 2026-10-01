<script setup>
import { useBudgetStore } from "@/stores/useBudgetStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { num } from "@/utils/parseNumber";

const props = defineProps({
  offers: {
    type: Array,
    required: true,
  },
  optionIndex: {
    type: Number,
    required: true,
  },
});

const budgetStore = useBudgetStore();

const getLineTotal = (offer) => num(offer.units) * num(offer.unitPrice);
</script>

<template>
  <div class="flex flex-col gap-2.5">
    <p v-if="offers.length === 0" class="py-2 text-[.88rem] italic text-faint">
      Aún no has añadido ninguna oferta.
    </p>

    <div
      v-for="(offer, index) in offers"
      :key="index"
      class="grid gap-2.5 rounded border border-line bg-panel p-3.5 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] sm:items-end"
    >
      <div>
        <label class="lbl" :for="`o-nombre-${optionIndex}-${index}`">
          Nombre de la oferta
        </label>
        <input
          :id="`o-nombre-${optionIndex}-${index}`"
          v-model="offer.name"
          type="text"
          class="inp disabled:text-dim"
          disabled
        />
      </div>

      <div>
        <label class="lbl" :for="`o-unidades-${optionIndex}-${index}`">
          Unidades
        </label>
        <input
          :id="`o-unidades-${optionIndex}-${index}`"
          v-model="offer.units"
          type="text"
          class="inp"
          inputmode="decimal"
          placeholder="0"
        />
      </div>

      <div>
        <label class="lbl" :for="`o-precio-${optionIndex}-${index}`">
          Precio / unidad
        </label>
        <input
          :id="`o-precio-${optionIndex}-${index}`"
          v-model="offer.unitPrice"
          type="text"
          class="inp"
          inputmode="decimal"
          placeholder="0,00"
        />
      </div>

      <div>
        <span class="lbl">Total</span>
        <div class="py-2 text-[1.05rem] tabular-nums">
          {{ formatCurrency(getLineTotal(offer)) }}
        </div>
      </div>

      <button
        type="button"
        aria-label="Eliminar línea"
        class="size-[34px] rounded-[3px] border border-line-strong text-base leading-none text-dim hover:border-wine hover:text-wine focus-visible:outline-2 focus-visible:outline-gold"
        @click="budgetStore.removeOfferAt(props.optionIndex, index)"
      >
        ×
      </button>
    </div>
  </div>
</template>
