<script setup>
import { computed, ref } from "vue";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { num } from "@/utils/parseNumber";
import { useBudgetPdf } from "@/utils/useBudgetPDF";

const budgetStore = useBudgetStore();
const { exportarPDF } = useBudgetPdf(budgetStore);
const isGeneratingPdf = ref(false);

async function handleDownloadPdf() {
  if (isGeneratingPdf.value || !canDownload.value) {
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

const canDownload = computed(() => {
  const { cliente, opciones } = budgetStore.formBudget;
  const clientReady = [cliente.nombre, cliente.evento, cliente.titulo].every(
    (value) => value.trim() !== "",
  );

  if (opciones.length === 0) {
    return false;
  }

  const optionsReady = opciones.every((opcion) => {
    if (opcion.lineas.length === 0) {
      return false;
    }

    return opcion.lineas.every(
      (line) => num(line.units) > 0 && num(line.unitPrice) > 0,
    );
  });

  return clientReady && optionsReady;
});
</script>

<template>
  <aside class="rounded border border-line bg-panel p-6 lg:sticky lg:top-6">
    <h2 class="mb-4 text-[1.05rem] font-medium text-dim">Resumen</h2>

    <div
      v-for="row in rows"
      :key="row.label"
      class="flex justify-between border-b border-line py-2 text-sm tabular-nums"
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
      <div class="mt-0.5 text-[2.1rem] font-medium tabular-nums text-gold">
        {{ formatCurrency(totals.total) }}
      </div>
    </div>

    <div class="mt-2 text-[.82rem] text-dim">
      {{ budgetStore.formBudget.iva }}
    </div>

    <button
      type="button"
      class="mt-5 w-full rounded-[3px] bg-gold px-4 py-2.5 text-sm font-medium text-ink hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="!canDownload || isGeneratingPdf"
      @click="handleDownloadPdf"
    >
      {{ isGeneratingPdf ? "Generando PDF..." : "Descargar PDF" }}
    </button>
  </aside>
</template>
