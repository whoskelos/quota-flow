<script setup>
import { useBudgetStore } from "@/stores/useBudgetStore";
import { formatCurrency } from "@/utils/formatCurrency";

const budgetStore = useBudgetStore();
</script>

<template>
  <div class="fgrid">
    <div>
      <label class="lbl" for="a-unidades">Unidades (ej. noches × personas)</label>
      <input
        id="a-unidades"
        v-model="budgetStore.formBudget.alojamiento.unidades"
        type="text"
        class="inp"
        inputmode="decimal"
        placeholder="0"
      />
    </div>

    <div>
      <label class="lbl" for="a-precio">€ / unidad</label>
      <input
        id="a-precio"
        v-model="budgetStore.formBudget.alojamiento.precio"
        type="text"
        class="inp"
        inputmode="decimal"
        placeholder="0,00"
      />
    </div>
  </div>

  <div class="subline">
    <span>Total alojamiento</span>
    <b>{{ formatCurrency(budgetStore.alojamientoTotal) }}</b>
  </div>
</template>
