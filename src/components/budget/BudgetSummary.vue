<script setup>
import { computed, ref } from "vue";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { useBudgetPdf } from "@/utils/useBudgetPDF";

const budgetStore = useBudgetStore();
const { exportarPDF } = useBudgetPdf(budgetStore);
const isGeneratingPdf = ref(false);

async function handleDownloadPdf() {
  if (isGeneratingPdf.value || !budgetStore.canDownload) {
    return;
  }

  isGeneratingPdf.value = true;
  try {
    await exportarPDF(budgetStore.formBudget);
  } catch (error) {
    console.error("Error al generar el PDF:", error);
  } finally {
    isGeneratingPdf.value = false;
  }
}

const rows = computed(() => [
  { label: "Dietas", value: budgetStore.dietasTotal },
  { label: "Transporte", value: budgetStore.transporteTotal },
  { label: "Alojamiento", value: budgetStore.alojamientoTotal },
]);

</script>

<template>
  <aside
    class="min-w-0 rounded border border-line bg-panel p-4 sm:p-6 lg:sticky lg:top-6"
  >
    <h2 class="mb-4 text-[1.05rem] font-medium text-dim">Resumen</h2>

    <div
      v-for="(row, index) in rows"
      :key="row.label"
      class="flex justify-between py-2 text-sm tabular-nums"
      :class="{ 'border-b border-line': index < rows.length - 1 }"
    >
      <span>{{ row.label }}</span>
      <span>{{ formatCurrency(row.value) }}</span>
    </div>

    <div
      v-for="(totals, index) in budgetStore.optionTotals"
      :key="budgetStore.formBudget.opciones[index].id"
      class="mt-4 border-t border-line-strong pt-4"
    >
      <div class="text-[.82rem] text-dim">Opción {{ index + 1 }}</div>
      <div v-if="totals.isManual" class="text-[.75rem] text-gold">
        Precio cerrado
      </div>
      <div
        class="mt-0.5 text-[clamp(1.5rem,7vw,2.1rem)] font-medium tabular-nums text-gold"
      >
        {{ formatCurrency(totals.total) }}
      </div>
    </div>

    <div class="mt-2 text-[.82rem] text-dim">
      {{ budgetStore.formBudget.iva }}
    </div>

    <button
      type="button"
      class="mt-5 min-h-11 w-full rounded-[3px] bg-gold px-4 py-2.5 text-sm font-medium text-ink hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="!budgetStore.canDownload || isGeneratingPdf"
      @click="handleDownloadPdf"
    >
      {{ isGeneratingPdf ? "Generando PDF..." : "Descargar PDF" }}
    </button>
  </aside>
</template>
