<script setup>
import { useBudgetStore } from "@/stores/useBudgetStore";
import { formatCurrency } from "@/utils/formatCurrency";

const budgetStore = useBudgetStore();
</script>

<template>
  <div class="fgrid">
    <div>
      <label class="lbl" for="t-km">Km (trayecto de ida)</label>
      <input
        id="t-km"
        v-model="budgetStore.formBudget.transporte.km"
        type="text"
        class="inp"
        inputmode="decimal"
        placeholder="0"
      />
    </div>

    <div>
      <label class="lbl" for="t-precio">€ / km</label>
      <input
        id="t-precio"
        v-model="budgetStore.formBudget.transporte.precio"
        type="text"
        class="inp"
        inputmode="decimal"
        placeholder="0,00"
      />
    </div>
  </div>

  <label class="flex items-center gap-2 text-[.88rem] text-dim">
    <input
      v-model="budgetStore.formBudget.transporte.idaVuelta"
      type="checkbox"
      class="size-4 accent-gold"
    />
    Ida y vuelta (duplica los km)
  </label>

  <div class="subline">
    <span>Total transporte</span>
    <b>{{ formatCurrency(budgetStore.transporteTotal) }}</b>
  </div>
</template>
