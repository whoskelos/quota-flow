<script setup>
import { useBudgetStore } from "@/stores/useBudgetStore";
const budgetStore = useBudgetStore();
</script>

<template>
  <section class="card">
    <h2 class="card-h2"><span class="card-dot"></span>Cliente y evento</h2>
    <p class="hint">Datos que identifican a quién va dirigido el presupuesto.</p>

    <div class="fgrid">
      <div>
        <label class="lbl" for="c-titulo">Título del presupuesto</label>
        <input
          id="c-titulo"
          v-model="budgetStore.formBudget.cliente.titulo"
          type="text"
          class="inp"
          placeholder="Presupuesto"
        />
      </div>

      <div>
        <label class="lbl" for="c-nombre">Nombre del cliente</label>
        <input
          id="c-nombre"
          v-model="budgetStore.formBudget.cliente.nombre"
          type="text"
          class="inp"
          placeholder="Cliente o empresa"
        />
      </div>

      <div>
        <label class="lbl" for="c-evento">Nombre del evento</label>
        <input
          id="c-evento"
          v-model="budgetStore.formBudget.cliente.evento"
          type="text"
          class="inp"
          placeholder="Ej. Mercado navideño"
        />
      </div>

      <div>
        <label class="lbl" for="c-emision">Fecha de emisión</label>
        <input
          id="c-emision"
          v-model="budgetStore.formBudget.cliente.fechaEmision"
          type="date"
          class="inp"
        />
      </div>

      <div>
        <label class="lbl" for="c-fechas">Fechas del evento</label>
        <input
          id="c-fechas"
          v-model="budgetStore.formBudget.cliente.fechasEvento"
          type="text"
          class="inp"
          placeholder="Ej. 13 y 14 de sept."
        />
      </div>
    </div>
  </section>
</template>
