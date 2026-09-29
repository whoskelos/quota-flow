<script setup>
defineProps({
  label: {
    type: String,
    default: "",
  },
});

const model = defineModel({ type: Boolean, default: false });
</script>

<template>
  <label class="relative h-6 w-[42px] shrink-0">
    <input
      v-model="model"
      type="checkbox"
      role="switch"
      :aria-label="label || undefined"
      class="peer absolute inset-0 z-10 m-0 cursor-pointer opacity-0"
    />
    <span
      class="absolute inset-0 rounded-full border border-line-strong bg-field transition-colors peer-checked:border-gold peer-checked:bg-gold/25 peer-focus-visible:outline-2 peer-focus-visible:outline-gold"
    ></span>
    <span
      class="absolute left-[3px] top-[3px] size-[18px] rounded-full bg-dim transition peer-checked:translate-x-[18px] peer-checked:bg-gold"
    ></span>
  </label>
</template>
