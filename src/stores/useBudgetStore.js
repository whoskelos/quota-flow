import { defineStore } from "pinia";
import { computed, reactive } from "vue";
import { num } from "@/utils/parseNumber";

export const useBudgetStore = defineStore("budget", () => {
  const createOption = () => ({
    id: crypto.randomUUID(),
    lineas: [],
    descuentoPct: 0,
    totalManual: null,
  });

  const initialState = () => ({
    cliente: {
      nombre: "",
      evento: "",
      fechaEmision: new Date().toISOString().slice(0, 10),
      fechasEvento: "",
      titulo: "",
    },
    opciones: [createOption()],
    dietas: { activo: false, personas: 0, precio: 0, dias: 1 },
    transporte: { activo: false, km: 0, precio: 0, idaVuelta: false },
    alojamiento: { activo: false, unidades: 0, precio: 0 },
    iva: "+ IVA",
  });

  const formBudget = reactive(initialState());

  const addOption = () => {
    formBudget.opciones.push(createOption());
  };

  const removeOption = (optionIndex) => {
    if (formBudget.opciones.length <= 1) {
      return;
    }
    formBudget.opciones.splice(optionIndex, 1);
  };

  const addOffer = (optionIndex, offer) => {
    formBudget.opciones[optionIndex].lineas.push(offer);
  };

  const removeOfferAt = (optionIndex, lineIndex) => {
    formBudget.opciones[optionIndex].lineas.splice(lineIndex, 1);
  };

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

  const extrasTotal = computed(() => {
    return dietasTotal.value + transporteTotal.value + alojamientoTotal.value;
  });

  const optionTotals = computed(() => {
    return formBudget.opciones.map((opcion) => {
      const subtotal = opcion.lineas.reduce(
        (acc, offer) => acc + num(offer.units) * num(offer.unitPrice),
        0,
      );
      const discount = (subtotal * num(opcion.descuentoPct)) / 100;
      const discounted = subtotal - discount;
      const calculated = discounted + extrasTotal.value;
      const isManual = num(opcion.totalManual) > 0;

      return {
        subtotal,
        discount,
        discounted,
        total: isManual ? num(opcion.totalManual) : calculated,
        isManual,
      };
    });
  });

  const canDownload = computed(() => {
    const { cliente, opciones } = formBudget;
    const clientReady = [cliente.nombre, cliente.evento, cliente.titulo].every(
      (value) => value.trim() !== "",
    );

    if (!clientReady || opciones.length === 0) {
      return false;
    }

    return opciones.every((opcion, index) => {
      if (opcion.lineas.length === 0) {
        return false;
      }

      const isManual = optionTotals.value[index].isManual;

      return opcion.lineas.every((line) => {
        if (num(line.units) <= 0) {
          return false;
        }

        if (isManual) {
          return true;
        }

        return num(line.unitPrice) > 0;
      });
    });
  });

  return {
    formBudget,
    addOption,
    removeOption,
    addOffer,
    removeOfferAt,
    dietasTotal,
    transporteTotal,
    alojamientoTotal,
    extrasTotal,
    optionTotals,
    canDownload,
  };
});
