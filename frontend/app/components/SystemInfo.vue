<template>
  <div class="bg-card border border-border rounded-[16px] p-6 shadow-card animate-fadeInUp border-l-[3px] border-l-info hover:shadow-[0_0_24px_rgba(56,189,248,0.25)] relative overflow-hidden transition-all duration-250 ease-out hover:-translate-y-[2px]">
    <div class="flex items-center gap-3 mb-5 pb-3 border-b border-border">
      <span class="text-[1.4rem]">⚙️</span>
      <h2 class="text-[1.1rem] font-bold tracking-[-0.01em]">System Information & Limits</h2>
    </div>

    <div class="flex flex-col">
      <!-- Inverter Temperature -->
      <div class="flex justify-between items-center py-3 border-b border-border last:border-b-0">
        <span class="text-[0.8rem] text-text-secondary">Inverter Temperature</span>
        <span class="text-[0.9rem] font-semibold text-text-primary" :style="{ color: tempColor }">
          {{ getVal("inverter_internal_temperature").toFixed(1) }} °C
        </span>
      </div>

      <!-- Operation Mode -->
      <div class="flex justify-between items-center py-3 border-b border-border last:border-b-0">
        <span class="text-[0.8rem] text-text-secondary">Operation Mode</span>
        <span class="text-[0.9rem] font-semibold text-info bg-info/[0.08] px-2 py-0.5 rounded">
          {{ opModeText }}
        </span>
      </div>

      <!-- Energy Produced Today -->
      <div class="flex justify-between items-center py-3 border-b border-border last:border-b-0">
        <span class="text-[0.8rem] text-text-secondary">Energy Produced Today</span>
        <span class="text-[0.9rem] font-semibold text-solar">
          {{ getVal("energy_produced_today").toFixed(1) }} kWh
        </span>
      </div>

      <!-- Lifetime Energy -->
      <div class="flex justify-between items-center py-3 border-b border-border last:border-b-0">
        <span class="text-[0.8rem] text-text-secondary">Energy Produced (Lifetime)</span>
        <span class="text-[0.9rem] font-semibold text-text-primary">
          {{ getVal("energy_produced_lifetime").toFixed(0) }} kWh
        </span>
      </div>

      <!-- Peak Power Today -->
      <div class="flex justify-between items-center py-3 border-b border-border last:border-b-0">
        <span class="text-[0.8rem] text-text-secondary">Peak Power Today</span>
        <span class="text-[0.9rem] font-semibold text-text-primary">
          {{ formatWatts(getVal("peak_production_power_today")) }}
        </span>
      </div>

      <!-- Max Grid Charge Limit -->
      <div class="flex justify-between items-center py-3 border-b border-border last:border-b-0">
        <span class="text-[0.8rem] text-text-secondary">Max Grid Charge Limit</span>
        <span class="text-[0.9rem] font-semibold text-text-primary">
          {{ formatWatts(getVal("maximum_grid_charging_power")) }}
        </span>
      </div>

      <!-- Max Battery Charge Limit -->
      <div class="flex justify-between items-center py-3 border-b border-border last:border-b-0">
        <span class="text-[0.8rem] text-text-secondary">Max Battery Charge Limit</span>
        <span class="text-[0.9rem] font-semibold text-text-primary">
          {{ formatWatts(getVal("battery_charging_max_power")) }}
        </span>
      </div>

      <!-- UPS Load (Heavy) Parameters -->
      <div class="flex justify-between items-center py-3 border-b border-border last:border-b-0">
        <span class="text-[0.8rem] text-text-secondary">UPS Output (Heavy)</span>
        <span class="text-[0.9rem] font-semibold text-text-primary">
          {{ getVal("load_voltage").toFixed(0) }} V / {{ getVal("load_current").toFixed(1) }} A / {{ getVal("grid_frequency").toFixed(1) }} Hz
        </span>
      </div>

      <!-- Light Load Parameters -->
      <div class="flex justify-between items-center py-3 border-b border-border last:border-b-0">
        <span class="text-[0.8rem] text-text-secondary">Light Load Bus</span>
        <span class="text-[0.9rem] font-semibold text-text-primary">
          {{ formatWatts(getVal("light_load_power")) }} ({{ calculateCurrent(getVal("light_load_power")).toFixed(1) }} A)
        </span>
      </div>

      <!-- Smart Load Parameters -->
      <div class="flex justify-between items-center py-3 border-b border-border last:border-b-0">
        <span class="text-[0.8rem] text-text-secondary">Smart Load Bus</span>
        <span class="text-[0.9rem] font-semibold text-text-primary">
          {{ formatWatts(getVal("smart_load_power")) }} ({{ calculateCurrent(getVal("smart_load_power")).toFixed(1) }} A)
        </span>
      </div>

      <!-- Operating Hours -->
      <div class="flex justify-between items-center py-3 border-b border-border last:border-b-0">
        <span class="text-[0.8rem] text-text-secondary">Operating Hours</span>
        <span class="text-[0.9rem] font-semibold text-text-primary">
          {{ getVal("inverter_operating_hours") }} h
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMetrics } from "~/composables/useMetrics";

const { getVal } = useMetrics();

const tempColor = computed(() => {
  const t = getVal("inverter_internal_temperature");
  if (t >= 70) return "#f87171"; // danger
  if (t >= 50) return "#fb923c"; // warning
  return "#34d399"; // success
});

const opModeText = computed(() => {
  const mode = getVal("inverter_operation_mode_raw");
  switch (mode) {
    case 0:
      return "Self Used";
    case 1:
      return "Feed-in Priority";
    case 2:
      return "Time Control";
    case 3:
      return "Back-up";
    default:
      return `Unknown (${mode})`;
  }
});

function formatWatts(val: number): string {
  if (val >= 1000) {
    return (val / 1000).toFixed(1) + " kW";
  }
  return val.toFixed(0) + " W";
}

function calculateCurrent(powerW: number): number {
  const v = getVal("load_voltage");
  if (v <= 10) return 0;
  return powerW / v;
}
</script>

