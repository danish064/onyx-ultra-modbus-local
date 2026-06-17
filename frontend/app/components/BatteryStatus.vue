<template>
  <div class="card card--battery fade-in-up">
    <div class="section-header">
      <span class="section-header__icon">🔋</span>
      <h2 class="section-header__title">Battery Status & Analytics</h2>
      <span class="section-header__badge">{{ batteryState }}</span>
    </div>

    <!-- Battery progress gauge -->
    <div class="gauge-section">
      <div class="battery-gauge">
        <div
          class="battery-gauge__fill"
          :style="{ width: `${soc}%`, backgroundColor: gaugeColor }"
        ></div>
        <div class="battery-gauge__label">{{ soc }}% SOC</div>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="metrics-grid">
      <div class="metric-block">
        <span class="metric-label">Battery Voltage</span>
        <span class="metric-value"
          >{{ getVal("battery_voltage").toFixed(1) }}
          <span class="metric-unit">V</span></span
        >
      </div>
      <div class="metric-block">
        <span class="metric-label">Battery Current</span>
        <span class="metric-value"
          >{{ getVal("battery_current").toFixed(1) }}
          <span class="metric-unit">A</span></span
        >
      </div>
      <div class="metric-block">
        <span class="metric-label">Active Power</span>
        <span class="metric-value"
          >{{ getVal("battery_power").toFixed(0) }}
          <span class="metric-unit">W</span></span
        >
      </div>
      <div class="metric-block">
        <span class="metric-label">Temperature</span>
        <span class="metric-value" :style="{ color: tempColor }"
          >{{ getVal("battery_temperature").toFixed(1) }}
          <span class="metric-unit">°C</span></span
        >
      </div>
      <div class="metric-block">
        <span class="metric-label">Charged Today</span>
        <span class="metric-value text-success"
          >{{ getVal("battery_charge_energy_today").toFixed(1) }}
          <span class="metric-unit">kWh</span></span
        >
      </div>
      <div class="metric-block">
        <span class="metric-label">Discharged Today</span>
        <span class="metric-value text-danger"
          >{{ getVal("battery_discharge_energy_today").toFixed(1) }}
          <span class="metric-unit">kWh</span></span
        >
      </div>
      <div class="metric-block">
        <span class="metric-label">Total Charged</span>
        <span class="metric-value"
          >{{ getVal("battery_charge_lifetime_energy").toFixed(0) }}
          <span class="metric-unit">kWh</span></span
        >
      </div>
      <div class="metric-block">
        <span class="metric-label">Total Discharged</span>
        <span class="metric-value"
          >{{ getVal("battery_discharge_lifetime_energy").toFixed(0) }}
          <span class="metric-unit">kWh</span></span
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
  if (t >= 45) return "var(--danger)";
  if (t >= 38) return "var(--warning)";
  return "var(--text-primary)";
});
</script>

<style scoped>
.gauge-section {
  margin-bottom: 24px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.metric-block {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.03);
  padding: 12px 16px;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  font-size: 0.72rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.metric-unit {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.text-success {
  color: var(--success);
}

.text-danger {
  color: var(--load);
}

@media (max-width: 900px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
