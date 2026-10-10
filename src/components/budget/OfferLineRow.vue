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
      class="grid gap-3 rounded border border-line bg-panel p-3.5 sm:p-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end lg:gap-2.5"
    >
      <div class="min-w-0 lg:col-span-1">
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

      <div class="grid grid-cols-2 gap-3 lg:contents">
        <div class="min-w-0">
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

        <div class="min-w-0">
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
      </div>

      <div
        class="flex items-end justify-between gap-3 border-t border-line pt-3 lg:contents lg:border-0 lg:pt-0"
      >
        <div class="min-w-0">
          <span class="lbl">Total</span>
          <div class="py-2 text-[1.05rem] tabular-nums">
            {{ formatCurrency(getLineTotal(offer)) }}
          </div>
        </div>

        <button
          type="button"
          aria-label="Eliminar línea"
          class="size-11 shrink-0 rounded-[3px] border border-line-strong text-lg leading-none text-dim hover:border-wine hover:text-wine focus-visible:outline-2 focus-visible:outline-gold lg:size-[34px] lg:text-base"
          @click="budgetStore.removeOfferAt(props.optionIndex, index)"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>
