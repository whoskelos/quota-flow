<script setup>
import ToggleSwitch from "./ToggleSwitch.vue";

defineProps({
  label: {
    type: String,
    required: true,
  },
});

const model = defineModel({ type: Boolean, default: false });
</script>

<template>
  <section class="card">
    <div class="mb-4 flex items-center justify-between gap-4">
      <h2 class="card-h2 !mb-0"><span class="card-dot"></span>{{ label }}</h2>
      <ToggleSwitch v-model="model" :label="label" />
    </div>

    <div v-if="model" class="grid gap-4">
      <slot />
    </div>
  </section>
</template>
