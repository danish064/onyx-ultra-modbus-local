<template>
  <div class="flex flex-col gap-0.5" :class="activeClass">
    <span class="text-[0.7rem] text-text-muted uppercase">{{ label }}</span>
    <span class="text-[0.85rem] font-semibold text-text-primary transition-all duration-300" :class="valueClass">
      {{ value }}
      <span v-if="details" class="block text-[0.72rem] text-text-muted font-medium mt-px">
        {{ details }}
      </span>
      <slot></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label: string;
  value?: string | number;
  details?: string;
  isActive?: boolean;
  color?: 'solar' | 'battery' | 'grid' | 'load';
}>();

const activeClass = computed(() => {
  if (!props.isActive) return '';
  return `sub-item--active-${props.color}`;
});

const valueClass = computed(() => {
  if (!props.isActive) return '';
  switch (props.color) {
    case 'solar': return 'text-solar drop-shadow-[0_0_8px_rgba(245,158,11,0.25)]';
    case 'battery': return 'text-battery drop-shadow-[0_0_8px_rgba(16,185,129,0.25)]';
    case 'grid': return 'text-grid drop-shadow-[0_0_8px_rgba(99,102,241,0.25)]';
    case 'load': return 'text-load drop-shadow-[0_0_8px_rgba(244,63,94,0.25)]';
    default: return '';
  }
});
</script>
