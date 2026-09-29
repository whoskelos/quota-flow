<script setup>
import { useBudgetStore } from "@/stores/useBudgetStore";
import { formatCurrency } from "@/utils/formatCurrency";

const budgetStore = useBudgetStore();
</script>

<template>
  <div class="fgrid">
    <div>
      <label class="lbl" for="d-personas">Nº de personas</label>
      <input
        id="d-personas"
        v-model="budgetStore.formBudget.dietas.personas"
        type="text"
        class="inp"
        inputmode="decimal"
        placeholder="0"
      />
    </div>

    <div>
      <label class="lbl" for="d-precio">€ / persona</label>
      <input
        id="d-precio"
        v-model="budgetStore.formBudget.dietas.precio"
        type="text"
        class="inp"
        inputmode="decimal"
        placeholder="0,00"
      />
    </div>

    <div>
      <label class="lbl" for="d-dias">Nº de días</label>
      <input
        id="d-dias"
        v-model="budgetStore.formBudget.dietas.dias"
        type="text"
        class="inp"
        inputmode="decimal"
        placeholder="1"
      />
    </div>
  </div>

  <div class="subline">
    <span>Total dietas</span>
    <b>{{ formatCurrency(budgetStore.dietasTotal) }}</b>
  </div>
</template>
