<script setup>
import AccommodationSection from "./AccommodationSection.vue";
import BudgetSummary from "./BudgetSummary.vue";
import ClientEventSection from "./ClientEventSection.vue";
import OfferLinesSection from "./OfferLinesSection.vue";
import PerDiemSection from "./PerDiemSection.vue";
import ToggleSection from "./ToggleSection.vue";
import TotalsSection from "./TotalsSection.vue";
import TransportSection from "./TransportSection.vue";

import { useBudgetStore } from "@/stores/useBudgetStore";

const budgetStore = useBudgetStore();
</script>

<template>
  <div
    class="mt-6 grid min-w-0 gap-8 sm:mt-10 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(260px,328px)] lg:items-start"
  >
    <form class="min-w-0">
      <ClientEventSection />
      <OfferLinesSection
        v-for="(opcion, index) in budgetStore.formBudget.opciones"
        :key="opcion.id"
        :option-index="index"
      />

      <div class="pb-2">
        <button
          type="button"
          class="min-h-11 rounded-[3px] border border-line-strong px-4 py-2.5 text-sm text-chalk hover:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          @click="budgetStore.addOption"
        >
          Añadir opción
        </button>
      </div>

      <ToggleSection
        v-model="budgetStore.formBudget.dietas.activo"
        label="Dietas"
      >
        <PerDiemSection />
      </ToggleSection>

      <ToggleSection
        v-model="budgetStore.formBudget.transporte.activo"
        label="Transporte"
      >
        <TransportSection />
      </ToggleSection>

      <ToggleSection
        v-model="budgetStore.formBudget.alojamiento.activo"
        label="Alojamiento"
      >
        <AccommodationSection />
      </ToggleSection>

      <TotalsSection />
    </form>

    <BudgetSummary />
  </div>
</template>
