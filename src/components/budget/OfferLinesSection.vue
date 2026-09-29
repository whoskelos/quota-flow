<script setup>
import { ref } from "vue";
import { useBudgetStore } from "@/stores/useBudgetStore";
import offerCatalog from "@/constants/offerCatalog";
import { formatCurrency } from "@/utils/formatCurrency";
import OfferLineRow from "./OfferLineRow.vue";

const budgetStore = useBudgetStore();

const selectedOffer = ref("");

const handleSelectOffer = () => {
  if (!selectedOffer.value) {
    return;
  }

  const offer = offerCatalog.find(
    (offer) => +offer.id === +selectedOffer.value,
  );

  budgetStore.addOffer({
    id: offer.id,
    name: offer.name,
    units: 0,
    unitPrice: 0,
  });

  selectedOffer.value = "";
};
</script>

<template>
  <section class="card">
    <h2 class="card-h2"><span class="card-dot"></span>Líneas de oferta</h2>
    <p class="hint">
      Añade tantas líneas como pases necesites. Puedes repetir la misma oferta
      con precios distintos.
    </p>

    <ul class="mb-5 grid gap-2">
      <li
        v-for="offer in offerCatalog"
        :key="offer.id"
        class="border-l-2 border-line-strong pl-3 text-[.82rem] text-dim"
      >
        <b class="font-semibold text-chalk">{{ offer.name }}</b> —
        {{ offer.description }}
      </li>
    </ul>

    <div class="mb-5 max-w-sm">
      <label class="lbl" for="add-offer">Añadir oferta</label>
      <select
        id="add-offer"
        v-model="selectedOffer"
        class="inp"
        @change="handleSelectOffer"
      >
        <option value="">Elige un pase del catálogo…</option>
        <option v-for="offer in offerCatalog" :key="offer.id" :value="offer.id">
          {{ offer.name }}
        </option>
      </select>
    </div>

    <OfferLineRow :offers="budgetStore.formBudget.ofertas.lineas" />

    <div class="subline">
      <span>Subtotal de ofertas</span>
      <b>{{ formatCurrency(budgetStore.offersSubtotal) }}</b>
    </div>

    <div class="mt-4 border-t border-line pt-4">
      <div class="max-w-[240px]">
        <label class="lbl" for="f-descuento">
          Descuento sobre este subtotal (%)
        </label>
        <input
          id="f-descuento"
          v-model="budgetStore.formBudget.ofertas.descuentoPct"
          type="text"
          class="inp disabled:opacity-50"
          :disabled="budgetStore.hasManualTotal"
          inputmode="decimal"
          placeholder="0"
        />
      </div>
      <div class="subline">
        <span>Descuento aplicado</span>
        <b class="!text-wine">
          −{{ formatCurrency(budgetStore.discountAmount) }}
        </b>
      </div>
      <div class="subline !mt-2 !border-solid !border-line-strong">
        <span>Subtotal de ofertas con descuento</span>
        <b>{{ formatCurrency(budgetStore.offersDiscounted) }}</b>
      </div>
      <p v-if="budgetStore.hasManualTotal" class="mt-2 text-[.8rem] text-gold">
        El total manual sustituye al cálculo automático; este descuento no se
        aplica.
      </p>
    </div>
  </section>
</template>
