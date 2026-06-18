<template>
  <div class="dashboard-grid fade-in-up">
    <!-- Solar Power Card -->
    <div class="card card--solar">
      <div class="card-header">
        <span class="card-title">☀️ Solar Power</span>
        <span class="icon-glow">☀️</span>
      </div>
      <div class="card-value-wrapper">
        <span class="card-value">{{
          formatPower(getVal("live_pv_total_power"))
        }}</span>
        <span class="card-unit">{{
          getPowerUnit(getVal("live_pv_total_power"))
        }}</span>
      </div>
      <div class="card-sub grid-sub-items">
        <div class="sub-item">
          <span class="sub-label">PV1</span>
          <span class="sub-val">
            {{ formatWOrKW(getVal("pv1_power")) }}
            <span class="sub-details">{{ getVal("pv1_voltage").toFixed(0) }}V / {{ getVal("pv1_current").toFixed(1)
            }}A</span>
          </span>
        </div>
        <div class="sub-item">
          <span class="sub-label">PV2</span>
          <span class="sub-val">
            {{ formatWOrKW(getVal("pv2_power")) }}
            <span class="sub-details">{{ getVal("pv2_voltage").toFixed(0) }}V / {{ getVal("pv2_current").toFixed(1)
            }}A</span>
          </span>
        </div>
        <div class="sub-item" v-if="getVal('pv3_power') > 0 || getVal('pv3_voltage') > 0">
          <span class="sub-label">PV3</span>
          <span class="sub-val">
            {{ formatWOrKW(getVal("pv3_power")) }}
            <span class="sub-details">{{ getVal("pv3_voltage").toFixed(0) }}V / {{ getVal("pv3_current").toFixed(1)
            }}A</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Battery Power Card -->
    <div class="card card--battery">
      <div class="card-header">
        <span class="card-title">🔋 Battery Power</span>
        <span class="icon-glow">🔋</span>
      </div>
      <div class="card-value-wrapper">
        <span class="card-value">{{
          formatPower(Math.abs(getVal("battery_power")))
        }}</span>
        <span class="card-unit">{{
          getPowerUnit(Math.abs(getVal("battery_power")))
        }}</span>
        <span class="direction-indicator" :class="getBatteryDirectionClass()">
          {{ getBatteryDirectionText() }}
        </span>
      </div>
      <div class="card-sub grid-sub-items">
        <div class="sub-item">
          <span class="sub-label">SOC</span>
          <span class="sub-val highlight-battery">{{ getVal("battery_soc") }}%</span>
        </div>
        <div class="sub-item">
          <span class="sub-label">Voltage</span>
          <span class="sub-val">{{ getVal("battery_voltage").toFixed(1) }}V</span>
        </div>
        <div class="sub-item">
          <span class="sub-label">Current</span>
          <span class="sub-val">{{ getVal("battery_current").toFixed(1) }}A</span>
        </div>
      </div>
    </div>

    <!-- Grid Power Card -->
    <div class="card card--grid">
      <div class="card-header">
        <span class="card-title">⚡ Grid Power</span>
        <span class="icon-glow">⚡</span>
      </div>
      <div class="card-value-wrapper">
        <span class="card-value">{{
          formatPower(Math.abs(getVal("grid_power")))
        }}</span>
        <span class="card-unit">{{
          getPowerUnit(Math.abs(getVal("grid_power")))
        }}</span>
        <span class="direction-indicator" :class="getGridDirectionClass()">
          {{ getGridDirectionText() }}
        </span>
      </div>
      <div class="card-sub grid-sub-items">
        <div class="sub-item">
          <span class="sub-label">Export</span>
          <span class="sub-val">{{
            formatWOrKW(getVal("grid_export_power"))
          }}</span>
        </div>
        <div class="sub-item">
          <span class="sub-label">Import Today</span>
          <span class="sub-val">{{ getVal("energy_import_today").toFixed(1) }} kWh</span>
        </div>
        <div class="sub-item">
          <span class="sub-label">Frequency</span>
          <span class="sub-val">{{ getVal("grid_frequency").toFixed(1) }}Hz</span>
        </div>
      </div>
    </div>

    <!-- Smart Load Card -->
    <div class="card card--load">
      <div class="card-header">
        <span class="card-title">🧠 Smart Load Power</span>
        <span class="icon-glow">🧠</span>
      </div>
      <div class="card-value-wrapper">
        <span class="card-value">{{ formatPower(getVal("smart_load_power")) }}</span>
        <span class="card-unit">{{ getPowerUnit(getVal("smart_load_power")) }}</span>
        <span class="card-details-inline">
          {{ getVal("load_voltage").toFixed(0) }}V / {{ calculateCurrent(getVal("smart_load_power")).toFixed(1) }}A
        </span>
      </div>
      <div class="card-sub grid-sub-items">

        <div class="sub-item">
          <span class="sub-label">Light Load</span>
          <span class="sub-val">
            {{ formatWOrKW(getVal("light_load_power")) }}
            <span class="sub-details">{{ getVal("load_voltage").toFixed(0) }}V / {{
              calculateCurrent(getVal("light_load_power")).toFixed(1) }}A</span>
          </span>
        </div>
        <div class="sub-item">
          <span class="sub-label">Load</span>
          <span class="sub-val">
            {{ formatWOrKW(getVal("load_power")) }}
            <span class="sub-details">{{ getVal("load_voltage").toFixed(0) }}V / {{ getVal("load_current").toFixed(1)
            }}A</span>
          </span>
        </div>
        <div class="sub-item">
          <span class="sub-label">UPS (Heavy)</span>
          <span class="sub-val">
            {{ getVal("load_voltage").toFixed(0) }}V / {{ getVal("load_current").toFixed(1) }}A
            <span class="sub-details">{{ getVal("grid_frequency").toFixed(1) }}Hz</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMetrics } from "~/composables/useMetrics";

const { getVal } = useMetrics();

function formatPower(val: number): string {
  if (val >= 1000) {
    return (val / 1000).toFixed(2);
  }
  return val.toFixed(0);
}

function getPowerUnit(val: number): string {
  return val >= 1000 ? "kW" : "W";
}

function formatWOrKW(val: number): string {
  if (val >= 1000) {
    return (val / 1000).toFixed(2) + " kW";
  }
  return val.toFixed(0) + " W";
}

function calculateCurrent(powerW: number): number {
  const v = getVal("load_voltage");
  if (v <= 10) return 0;
  return powerW / v;
}

// Battery helper states
function getBatteryDirectionClass(): string {
  const pwr = getVal("battery_power");
  if (pwr > 10) return "indicator--discharging";
  if (pwr < -10) return "indicator--charging";
  return "indicator--idle";
}

function getBatteryDirectionText(): string {
  const pwr = getVal("battery_power");
  if (pwr > 10) return "Discharging";
  if (pwr < -10) return "Charging";
  return "Idle";
}

// Grid helper states
function getGridDirectionClass(): string {
  const pwr = getVal("grid_power");
  if (pwr > 10) return "indicator--importing";
  if (pwr < -10) return "indicator--exporting";
  return "indicator--idle";
}

function getGridDirectionText(): string {
  const pwr = getVal("grid_power");
  if (pwr > 10) return "Importing";
  if (pwr < -10) return "Exporting";
  return "Online";
}
</script>

<style scoped>
.card-value-wrapper {
  display: flex;
  align-items: baseline;
  gap: 4px;
  position: relative;
}

.card-details-inline {
  margin-left: auto;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.05);
  padding: 3px 8px;
  border-radius: 6px;
  align-self: center;
}

.icon-glow {
  font-size: 1.2rem;
  opacity: 0.6;
  filter: drop-shadow(0 0 8px currentColor);
}

.grid-sub-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.sub-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sub-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
}

.sub-val {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
}

.sub-details {
  display: block;
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 500;
  margin-top: 1px;
}

.highlight-battery {
  color: var(--battery);
}

.direction-indicator {
  margin-left: auto;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.05em;
  align-self: center;
}

.indicator--discharging {
  background: rgba(244, 63, 94, 0.15);
  color: var(--load);
}

.indicator--charging {
  background: rgba(16, 185, 129, 0.15);
  color: var(--battery);
}

.indicator--idle {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-muted);
}

.indicator--importing {
  background: rgba(99, 102, 241, 0.15);
  color: var(--grid);
}

.indicator--exporting {
  background: rgba(245, 158, 11, 0.15);
  color: var(--solar);
}
</style>
