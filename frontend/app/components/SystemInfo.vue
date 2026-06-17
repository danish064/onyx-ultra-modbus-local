<template>
  <div class="card card--info fade-in-up">
    <div class="section-header">
      <span class="section-header__icon">⚙️</span>
      <h2 class="section-header__title">System Information & Limits</h2>
    </div>

    <div class="info-table">
      <!-- Inverter Temperature -->
      <div class="info-row">
        <span class="info-label">Inverter Temperature</span>
        <span class="info-value" :style="{ color: tempColor }">
          {{ getVal("inverter_internal_temperature").toFixed(1) }} °C
        </span>
      </div>

      <!-- Operation Mode -->
      <div class="info-row">
        <span class="info-label">Operation Mode</span>
        <span class="info-value highlight-mode">
          {{ opModeText }}
        </span>
      </div>

      <!-- Energy Produced Today -->
      <div class="info-row">
        <span class="info-label">Energy Produced Today</span>
        <span class="info-value text-solar">
          {{ getVal("energy_produced_today").toFixed(1) }} kWh
        </span>
      </div>

      <!-- Lifetime Energy -->
      <div class="info-row">
        <span class="info-label">Energy Produced (Lifetime)</span>
        <span class="info-value">
          {{ getVal("energy_produced_lifetime").toFixed(0) }} kWh
        </span>
      </div>

      <!-- Peak Power Today -->
      <div class="info-row">
        <span class="info-label">Peak Power Today</span>
        <span class="info-value">
          {{ formatWatts(getVal("peak_production_power_today")) }}
        </span>
      </div>

      <!-- Max Grid Charge Limit -->
      <div class="info-row">
        <span class="info-label">Max Grid Charge Limit</span>
        <span class="info-value">
          {{ formatWatts(getVal("maximum_grid_charging_power")) }}
        </span>
      </div>

      <!-- Max Battery Charge Limit -->
      <div class="info-row">
        <span class="info-label">Max Battery Charge Limit</span>
        <span class="info-value">
          {{ formatWatts(getVal("battery_charging_max_power")) }}
        </span>
      </div>

      <!-- UPS Load (Heavy) Parameters -->
      <div class="info-row">
        <span class="info-label">UPS Output (Heavy)</span>
        <span class="info-value">
          {{ getVal("load_voltage").toFixed(0) }} V / {{ getVal("load_current").toFixed(1) }} A / {{ getVal("grid_frequency").toFixed(1) }} Hz
        </span>
      </div>

      <!-- Light Load Parameters -->
      <div class="info-row">
        <span class="info-label">Light Load Bus</span>
        <span class="info-value">
          {{ formatWatts(getVal("light_load_power")) }} ({{ calculateCurrent(getVal("light_load_power")).toFixed(1) }} A)
        </span>
      </div>

      <!-- Smart Load Parameters -->
      <div class="info-row">
        <span class="info-label">Smart Load Bus</span>
        <span class="info-value">
          {{ formatWatts(getVal("smart_load_power")) }} ({{ calculateCurrent(getVal("smart_load_power")).toFixed(1) }} A)
        </span>
      </div>

      <!-- Operating Hours -->
      <div class="info-row">
        <span class="info-label">Operating Hours</span>
        <span class="info-value">
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
  if (t >= 70) return "var(--danger)";
  if (t >= 50) return "var(--warning)";
  return "var(--success)";
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

<style scoped>
.info-table {
  display: flex;
  flex-direction: column;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.info-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.highlight-mode {
  color: var(--info);
  background: rgba(56, 189, 248, 0.08);
  padding: 2px 8px;
  border-radius: 4px;
}

.text-solar {
  color: var(--solar);
}
</style>
