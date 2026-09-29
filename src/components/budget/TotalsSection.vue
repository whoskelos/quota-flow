<script setup>
import ivaCatalog from "@/constants/iva";
import { useBudgetStore } from "@/stores/useBudgetStore";

const budgetStore = useBudgetStore();
</script>

<template>
  <section class="card">
    <h2 class="card-h2"><span class="card-dot"></span>Total manual e IVA</h2>
    <p class="hint">
      Rellena un total manual solo si el precio final es una cifra cerrada
      acordada con el cliente; sustituye a todo el cálculo automático, descuento
      incluido.
    </p>

    <div class="fgrid">
      <div>
        <label class="lbl" for="f-manual">Total manual (€)</label>
        <input
          id="f-manual"
          v-model="budgetStore.formBudget.totalManual"
          type="text"
          class="inp"
          inputmode="decimal"
          placeholder="Déjalo vacío para calcular automáticamente"
        />
      </div>

      <div>
        <label class="lbl" for="f-iva">IVA</label>
        <select id="f-iva" v-model="budgetStore.formBudget.iva" class="inp">
          <option v-for="iva in ivaCatalog" :key="iva.id" :value="iva.name">
            {{ iva.name }}
          </option>
        </select>
      </div>
    </div>
  </section>
</template>
