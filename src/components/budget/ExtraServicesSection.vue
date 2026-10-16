<script setup>
import { useBudgetStore } from "@/stores/useBudgetStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { num } from "@/utils/parseNumber";

const budgetStore = useBudgetStore();

const getLineTotal = (servicio) => num(servicio.horas) * num(servicio.precioHora);
</script>

<template>
  <section class="card">
    <h2 class="card-h2">
      <span class="card-dot"></span>Servicios extras
    </h2>
    <p class="hint">
      Añade servicios que no están en el catálogo, con su coste por hora.
    </p>

    <div class="flex flex-col gap-2.5">
      <p
        v-if="budgetStore.formBudget.serviciosExtras.length === 0"
        class="py-2 text-[.88rem] italic text-faint"
      >
        Aún no has añadido ningún servicio extra.
      </p>

      <div
        v-for="servicio in budgetStore.formBudget.serviciosExtras"
        :key="servicio.id"
        class="grid gap-3 rounded border border-line bg-panel p-3.5 sm:p-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end lg:gap-2.5"
      >
        <div class="min-w-0">
          <label class="lbl" :for="`se-desc-${servicio.id}`">Servicio</label>
          <input
            :id="`se-desc-${servicio.id}`"
            v-model="servicio.descripcion"
            type="text"
            class="inp"
            placeholder="Animación"
          />
        </div>

        <div class="grid grid-cols-2 gap-3 lg:contents">
          <div class="min-w-0">
            <label class="lbl" :for="`se-horas-${servicio.id}`">Horas</label>
            <input
              :id="`se-horas-${servicio.id}`"
              v-model="servicio.horas"
              type="text"
              class="inp"
              inputmode="decimal"
              placeholder="0"
            />
          </div>

          <div class="min-w-0">
            <label class="lbl" :for="`se-precio-${servicio.id}`">€ / hora</label>
            <input
              :id="`se-precio-${servicio.id}`"
              v-model="servicio.precioHora"
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
              {{ formatCurrency(getLineTotal(servicio)) }}
            </div>
          </div>

          <button
            type="button"
            aria-label="Eliminar servicio extra"
            class="size-11 shrink-0 rounded-[3px] border border-line-strong text-lg leading-none text-dim hover:border-wine hover:text-wine focus-visible:outline-2 focus-visible:outline-gold lg:size-[34px] lg:text-base"
            @click="budgetStore.removeServicioExtra(servicio.id)"
          >
            ×
          </button>
        </div>
      </div>
    </div>

    <button
      type="button"
      class="mt-4 min-h-11 rounded-[3px] border border-line-strong px-4 py-2.5 text-sm text-chalk hover:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      @click="budgetStore.addServicioExtra"
    >
      Añadir servicio
    </button>

    <div class="subline">
      <span>Total servicios extras</span>
      <b>{{ formatCurrency(budgetStore.serviciosExtrasTotal) }}</b>
    </div>
  </section>
</template>
