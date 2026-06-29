<template>
  <header class="sticky top-0 z-[100] h-16 px-6 bg-primary/85 backdrop-blur-[20px] border-b border-border flex items-center justify-between animate-fadeInUp">
    <div class="flex items-center gap-2.5">
      <span class="text-[1.4rem]">☀️</span>
      <h1 class="text-[1.1rem] font-bold text-text-primary m-0 tracking-[-0.01em]">SolarMax Onyx PV 9000</h1>
    </div>

    <div class="hidden sm:flex items-center bg-white/[0.03] px-3.5 py-1.5 rounded-full border border-border">
      <span
        class="w-2 h-2 rounded-full inline-block mr-1.5"
        :class="isConnected ? 'bg-success shadow-[0_0_8px_theme(colors.success)] animate-[pulse-glow_2s_ease-in-out_infinite]' : 'bg-danger shadow-[0_0_8px_theme(colors.danger)]'"
      ></span>
      <span class="text-[0.85rem] font-semibold text-text-primary mr-3">{{
        isConnected ? "Connected" : "Disconnected"
      }}</span>
      <span class="text-[0.7rem] font-bold bg-grid/[0.15] text-grid px-2 py-0.5 rounded-full border border-grid/20" v-if="isConnected">Polls: {{ pollCount }}</span>
      <span class="text-[0.7rem] font-semibold bg-danger/10 text-danger px-2 py-0.5 ml-2 rounded-full border border-danger/20" v-if="!isConnected && error">{{ error }}</span>
    </div>

    <div class="flex items-center gap-4">
      <span class="text-[0.8rem] text-text-muted" v-if="timestamp"
        >Last Updated: {{ formatTime(timestamp) }}</span
      >
      <button class="bg-[linear-gradient(135deg,theme(colors.solar),#d97706)] text-white border-none text-[0.8rem] font-bold px-4 py-2 rounded-full cursor-pointer flex items-center gap-1.5 transition-all duration-200 shadow-[0_4px_12px_rgba(245,158,11,0.2)] hover:not-disabled:-translate-y-[1px] hover:not-disabled:shadow-[0_6px_16px_rgba(245,158,11,0.3)] active:not-disabled:translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed" @click="fetchMetrics" :disabled="isLoading">
        <span v-if="isLoading" class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-[spin_1s_linear_infinite]"></span>
        <span v-else>Refresh</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useMetrics } from "~/composables/useMetrics";

const { isConnected, timestamp, isLoading, fetchMetrics, pollCount, error } =
  useMetrics();

function formatTime(tsString: string): string {
  if (!tsString) return "";
  try {
    const date = new Date(tsString);
    return date.toLocaleTimeString("en-US", { hour12: false });
  } catch (e) {
    return tsString;
  }
}
</script>

