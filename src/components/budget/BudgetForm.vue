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

const submitForm = () => {
  console.log("submitForm");
};
</script>

<template>
  <div class="mt-10 grid gap-10 lg:grid-cols-[1fr_328px] lg:items-start">
    <form @submit.prevent="submitForm">
      <ClientEventSection />
      <OfferLinesSection />

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
