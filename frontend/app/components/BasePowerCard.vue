<template>
  <div class="relative overflow-hidden bg-card border border-border rounded-[16px] p-6 shadow-card transition-all duration-250 ease-out before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent hover:-translate-y-[2px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-border-accent"
       :class="[cardColorClass, cardActiveClass]">
    <div class="flex items-center justify-between mb-4">
      <span class="text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-text-secondary">
        {{ title }}
      </span>
      <span class="text-[1.2rem] opacity-60 drop-shadow-[0_0_8px_currentColor]" :class="iconActiveClass">
        {{ icon }}
      </span>
    </div>

    <div class="flex items-baseline gap-1 relative">
      <span class="text-[2.2rem] font-extrabold leading-none tracking-[-0.02em]" :class="valueClass">{{ value }}</span>
      <span class="text-[0.9rem] font-medium text-text-secondary ml-1">{{ unit }}</span>
      <slot name="inline-details"></slot>
    </div>

    <div class="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/5">
      <slot name="sub-items"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  icon: string;
  value: string | number;
  unit: string;
  color: 'solar' | 'battery' | 'grid' | 'load' | 'info';
  isActive?: boolean;
}>();

const cardColorClass = computed(() => {
  switch (props.color) {
    case 'solar': return 'border-l-[3px] border-l-solar hover:shadow-[0_0_24px_rgba(245,158,11,0.25)]';
    case 'battery': return 'border-l-[3px] border-l-battery hover:shadow-[0_0_24px_rgba(16,185,129,0.25)]';
    case 'grid': return 'border-l-[3px] border-l-grid hover:shadow-[0_0_24px_rgba(99,102,241,0.25)]';
    case 'load': return 'border-l-[3px] border-l-load hover:shadow-[0_0_24px_rgba(244,63,94,0.25)]';
    case 'info': return 'border-l-[3px] border-l-info hover:shadow-[0_0_24px_rgba(56,189,248,0.25)]';
    default: return '';
  }
});

const valueClass = computed(() => {
  switch (props.color) {
    case 'solar': return 'text-solar';
    case 'battery': return 'text-battery';
    case 'grid': return 'text-grid';
    case 'load': return 'text-load';
    case 'info': return 'text-info';
    default: return '';
  }
});

const cardActiveClass = computed(() => {
  if (!props.isActive) return '';
  switch (props.color) {
    case 'solar': return 'animate-pulse-card-solar border-solar/40 shadow-[0_4px_24px_rgba(0,0,0,0.35),0_0_15px_rgba(245,158,11,0.25)]';
    case 'battery': return 'animate-pulse-card-battery border-battery/40 shadow-[0_4px_24px_rgba(0,0,0,0.35),0_0_15px_rgba(16,185,129,0.25)]';
    case 'grid': return 'animate-pulse-card-grid border-grid/40 shadow-[0_4px_24px_rgba(0,0,0,0.35),0_0_15px_rgba(99,102,241,0.25)]';
    case 'load': return 'animate-pulse-card-load border-load/40 shadow-[0_4px_24px_rgba(0,0,0,0.35),0_0_15px_rgba(244,63,94,0.25)]';
    default: return '';
  }
});

const iconActiveClass = computed(() => {
  if (!props.isActive) return '';
  switch (props.color) {
    case 'solar': return 'animate-[spin_12s_linear_infinite,pulse-icon_2s_infinite_ease-in-out] text-solar opacity-100';
    case 'battery': return 'animate-[pulse-icon_2s_infinite_ease-in-out] text-battery opacity-100';
    case 'grid': return 'animate-[flicker-icon_1.5s_infinite_ease-in-out] text-grid opacity-100';
    case 'load': return 'animate-[pulse-icon_2s_infinite_ease-in-out] text-load opacity-100';
    default: return '';
  }
});
</script>


