<script setup>
import BudgetForm from "@/components/budget/BudgetForm.vue";
</script>

<template>
  <div
    class="mx-auto max-w-[1180px] px-4 pb-16 pt-[env(safe-area-inset-top)] sm:px-6"
  >
    <header
      class="relative flex flex-col gap-1.5 border-b border-line pb-10 pt-10 sm:pt-14"
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="17"
          cy="17"
          r="15"
          class="stroke-gold"
          stroke-width="1.5"
        />
        <path
          d="M7 21 C 11 11, 23 11, 27 21"
          class="stroke-wine"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <h1
        class="mt-2.5 text-[clamp(2rem,5vw,3.1rem)] font-semibold tracking-tight"
      >
        Aeria&nbsp;Trois
      </h1>
      <p class="max-w-[46ch] text-base text-dim">
        Generador de presupuestos para actuaciones aéreas. Rellena cada apartado
        y el total se calcula solo.
      </p>
      <svg
        class="absolute right-0 top-8 hidden h-[120px] w-[180px] opacity-50 sm:block"
        viewBox="0 0 180 120"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 4 H178"
          class="stroke-chalk"
          stroke-width="1"
          stroke-opacity="0.5"
        />
        <path d="M60 4 V96" class="stroke-gold" stroke-width="1" />
        <path d="M120 4 V70" class="stroke-gold" stroke-width="1" />
        <path
          d="M60 96 Q 90 118, 120 70"
          class="stroke-wine"
          stroke-width="1.5"
        />
        <circle cx="60" cy="96" r="2.5" class="fill-gold" />
        <circle cx="120" cy="70" r="2.5" class="fill-gold" />
      </svg>
    </header>

    <BudgetForm />
  </div>
</template>
