<script setup>
import ivaCatalog from "@/constants/iva";
import { useBudgetStore } from "@/stores/useBudgetStore";

const budgetStore = useBudgetStore();
</script>

<template>
  <section class="card">
    <h2 class="card-h2"><span class="card-dot"></span>IVA</h2>

    <div class="max-w-[240px]">
      <label class="lbl" for="f-iva">IVA</label>
      <select id="f-iva" v-model="budgetStore.formBudget.iva" class="inp">
        <option v-for="iva in ivaCatalog" :key="iva.id" :value="iva.name">
          {{ iva.name }}
        </option>
      </select>
    </div>
  </section>
</template>
