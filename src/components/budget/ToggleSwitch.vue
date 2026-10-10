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
  <label
    class="relative flex size-11 shrink-0 cursor-pointer items-center justify-center"
  >
    <input
      v-model="model"
      type="checkbox"
      role="switch"
      :aria-label="label || undefined"
      class="peer absolute inset-0 z-10 m-0 cursor-pointer opacity-0"
    />
    <span
      class="relative flex h-6 w-[42px] items-center rounded-full border border-line-strong bg-field px-[3px] transition-colors peer-checked:border-gold peer-checked:bg-gold/25 peer-checked:[&>span]:translate-x-[18px] peer-checked:[&>span]:bg-gold peer-focus-visible:outline-2 peer-focus-visible:outline-gold"
    >
      <span
        class="size-[18px] shrink-0 rounded-full bg-dim transition-transform"
      ></span>
    </span>
  </label>
</template>
