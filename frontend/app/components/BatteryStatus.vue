<template>
  <div class="bg-card border border-border rounded-[16px] p-6 shadow-card animate-fadeInUp border-l-[3px] border-l-battery hover:shadow-[0_0_24px_rgba(16,185,129,0.25)] relative overflow-hidden transition-all duration-250 ease-out hover:-translate-y-[2px]">
    <div class="flex items-center gap-3 mb-5 pb-3 border-b border-border">
      <span class="text-[1.4rem]">🔋</span>
      <h2 class="text-[1.1rem] font-bold tracking-[-0.01em]">Battery Status & Analytics</h2>
      <span class="ml-auto text-[0.7rem] font-semibold uppercase tracking-[0.06em] px-2.5 py-1 rounded-full bg-info/10 text-info border border-info/20">{{ batteryState }}</span>
    </div>

    <!-- Battery progress gauge -->
    <div class="mb-6">
      <div class="w-full h-7 rounded-full overflow-hidden relative border border-battery/15 bg-battery/10">
        <div
          class="h-full rounded-full relative transition-[width] duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.12)_50%,transparent_100%)] after:bg-[length:200%_100%] after:animate-shimmer"
          :style="{ width: `${soc}%`, backgroundColor: gaugeColor }"
        ></div>
        <div class="absolute inset-0 flex items-center justify-center text-[0.75rem] font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">{{ soc }}% SOC</div>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white/[0.02] border border-white/[0.03] px-4 py-3 rounded-md flex flex-col gap-1">
        <span class="text-[0.72rem] text-text-muted uppercase tracking-[0.02em]">Battery Voltage</span>
        <span class="text-xl font-bold text-text-primary"
          >{{ getVal("battery_voltage").toFixed(1) }}
          <span class="text-[0.8rem] font-medium text-text-secondary">V</span></span
        >
      </div>
      <div class="bg-white/[0.02] border border-white/[0.03] px-4 py-3 rounded-md flex flex-col gap-1">
        <span class="text-[0.72rem] text-text-muted uppercase tracking-[0.02em]">Battery Current</span>
        <span class="text-xl font-bold text-text-primary"
          >{{ getVal("battery_current").toFixed(1) }}
          <span class="text-[0.8rem] font-medium text-text-secondary">A</span></span
        >
      </div>
      <div class="bg-white/[0.02] border border-white/[0.03] px-4 py-3 rounded-md flex flex-col gap-1">
        <span class="text-[0.72rem] text-text-muted uppercase tracking-[0.02em]">Active Power</span>
        <span class="text-xl font-bold text-text-primary"
          >{{ getVal("battery_power").toFixed(0) }}
          <span class="text-[0.8rem] font-medium text-text-secondary">W</span></span
        >
      </div>
      <div class="bg-white/[0.02] border border-white/[0.03] px-4 py-3 rounded-md flex flex-col gap-1">
        <span class="text-[0.72rem] text-text-muted uppercase tracking-[0.02em]">Temperature</span>
        <span class="text-xl font-bold text-text-primary" :style="{ color: tempColor }"
          >{{ getVal("battery_temperature").toFixed(1) }}
          <span class="text-[0.8rem] font-medium text-text-secondary">°C</span></span
        >
      </div>
      <div class="bg-white/[0.02] border border-white/[0.03] px-4 py-3 rounded-md flex flex-col gap-1">
        <span class="text-[0.72rem] text-text-muted uppercase tracking-[0.02em]">Charged Today</span>
        <span class="text-xl font-bold text-success"
          >{{ getVal("battery_charge_energy_today").toFixed(1) }}
          <span class="text-[0.8rem] font-medium text-text-secondary">kWh</span></span
        >
      </div>
      <div class="bg-white/[0.02] border border-white/[0.03] px-4 py-3 rounded-md flex flex-col gap-1">
        <span class="text-[0.72rem] text-text-muted uppercase tracking-[0.02em]">Discharged Today</span>
        <span class="text-xl font-bold text-load"
          >{{ getVal("battery_discharge_energy_today").toFixed(1) }}
          <span class="text-[0.8rem] font-medium text-text-secondary">kWh</span></span
        >
      </div>
      <div class="bg-white/[0.02] border border-white/[0.03] px-4 py-3 rounded-md flex flex-col gap-1">
        <span class="text-[0.72rem] text-text-muted uppercase tracking-[0.02em]">Total Charged</span>
        <span class="text-xl font-bold text-text-primary"
          >{{ getVal("battery_charge_lifetime_energy").toFixed(0) }}
          <span class="text-[0.8rem] font-medium text-text-secondary">kWh</span></span
        >
      </div>
      <div class="bg-white/[0.02] border border-white/[0.03] px-4 py-3 rounded-md flex flex-col gap-1">
        <span class="text-[0.72rem] text-text-muted uppercase tracking-[0.02em]">Total Discharged</span>
        <span class="text-xl font-bold text-text-primary"
          >{{ getVal("battery_discharge_lifetime_energy").toFixed(0) }}
          <span class="text-[0.8rem] font-medium text-text-secondary">kWh</span></span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMetrics } from "~/composables/useMetrics";

const { getVal } = useMetrics();

const soc = computed(() => getVal("battery_soc"));

const batteryState = computed(() => {
  const pwr = getVal("battery_power");
  if (pwr > 10) return "Discharging";
  if (pwr < -10) return "Charging";
  return "Full / Idle";
});

const gaugeColor = computed(() => {
  const currentSoc = soc.value;
  if (currentSoc <= 20) return "#ef4444"; // Red
  if (currentSoc <= 50) return "#f59e0b"; // Amber
  return "#10b981"; // Green
});

const tempColor = computed(() => {
  const t = getVal("battery_temperature");
  if (t >= 45) return "#f87171"; // danger
  if (t >= 38) return "#fb923c"; // warning
  return "#f1f5f9"; // text-primary
});
</script>

