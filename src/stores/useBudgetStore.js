import { defineStore } from "pinia";
import { computed, reactive } from "vue";
import { num } from "@/utils/parseNumber";

export const useBudgetStore = defineStore("budget", () => {
  const initialState = () => ({
    cliente: {
      nombre: "",
      evento: "",
      fechaEmision: new Date().toISOString().slice(0, 10),
      fechasEvento: "",
      titulo: "",
    },
    ofertas: { lineas: [], descuentoPct: 0 },
    dietas: { activo: false, personas: 0, precio: 0, dias: 1 },
    transporte: { activo: false, km: 0, precio: 0, idaVuelta: false },
    alojamiento: { activo: false, unidades: 0, precio: 0 },
    totalManual: null,
    iva: "+ IVA",
  });

  const formBudget = reactive(initialState());

  const addOffer = (offer) => {
    formBudget.ofertas.lineas.push(offer);
  };

  const removeOfferAt = (index) => {
    formBudget.ofertas.lineas.splice(index, 1);
  };

  const offersSubtotal = computed(() => {
    return formBudget.ofertas.lineas.reduce(
      (acc, offer) => acc + num(offer.units) * num(offer.unitPrice),
      0,
    );
  });

  const discountAmount = computed(() => {
    return (offersSubtotal.value * num(formBudget.ofertas.descuentoPct)) / 100;
  });

  const offersDiscounted = computed(() => {
    return offersSubtotal.value - discountAmount.value;
  });

  const dietasTotal = computed(() => {
    const { activo, personas, precio, dias } = formBudget.dietas;
    if (!activo) {
      return 0;
    }
    return num(personas) * num(precio) * num(dias);
  });

  const transporteTotal = computed(() => {
    const { activo, km, precio, idaVuelta } = formBudget.transporte;
    if (!activo) {
      return 0;
    }
    return num(km) * (idaVuelta ? 2 : 1) * num(precio);
  });

  const alojamientoTotal = computed(() => {
    const { activo, unidades, precio } = formBudget.alojamiento;
    if (!activo) {
      return 0;
    }
    return num(unidades) * num(precio);
  });

  const subTotal = computed(() => {
    return (
      offersDiscounted.value +
      dietasTotal.value +
      transporteTotal.value +
      alojamientoTotal.value
    );
  });

  const hasManualTotal = computed(() => num(formBudget.totalManual) > 0);

  const total = computed(() =>
    hasManualTotal.value ? num(formBudget.totalManual) : subTotal.value,
  );

  return {
    formBudget,
    addOffer,
    removeOfferAt,
    offersSubtotal,
    discountAmount,
    offersDiscounted,
    dietasTotal,
    transporteTotal,
    alojamientoTotal,
    subTotal,
    hasManualTotal,
    total,
  };
});
