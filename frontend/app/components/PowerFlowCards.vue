<template>
  <div class="dashboard-grid fade-in-up">
    <!-- Solar Power Card -->
    <div class="card card--solar" :class="{ 'card--active': getVal('live_pv_total_power') > 10 }">
      <div class="card-header">
        <span class="card-title">☀️ Solar Power</span>
        <span class="icon-glow" :class="{ 'icon-glow--solar-active': getVal('live_pv_total_power') > 10 }">☀️</span>
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
        <div class="sub-item" :class="{ 'sub-item--active-solar': getVal('pv1_power') > 10 }">
          <span class="sub-label">PV1</span>
          <span class="sub-val">
            {{ formatWOrKW(getVal("pv1_power")) }}
            <span class="sub-details">{{ getVal("pv1_voltage").toFixed(0) }}V / {{ getVal("pv1_current").toFixed(1) }}A</span>
          </span>
        </div>
        <div class="sub-item" :class="{ 'sub-item--active-solar': getVal('pv2_power') > 10 }">
          <span class="sub-label">PV2</span>
          <span class="sub-val">
            {{ formatWOrKW(getVal("pv2_power")) }}
            <span class="sub-details">{{ getVal("pv2_voltage").toFixed(0) }}V / {{ getVal("pv2_current").toFixed(1) }}A</span>
          </span>
        </div>
        <div class="sub-item" v-if="getVal('pv3_power') > 0 || getVal('pv3_voltage') > 0" :class="{ 'sub-item--active-solar': getVal('pv3_power') > 10 }">
          <span class="sub-label">PV3</span>
          <span class="sub-val">
            {{ formatWOrKW(getVal("pv3_power")) }}
            <span class="sub-details">{{ getVal("pv3_voltage").toFixed(0) }}V / {{ getVal("pv3_current").toFixed(1) }}A</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Battery Power Card -->
    <div class="card card--battery" :class="{ 'card--active': Math.abs(getVal('battery_power')) > 10 }">
      <div class="card-header">
        <span class="card-title">🔋 Battery Power</span>
        <span class="icon-glow" :class="{ 'icon-glow--battery-active': Math.abs(getVal('battery_power')) > 10 }">🔋</span>
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
        <div class="sub-item" :class="{ 'sub-item--active-battery': Math.abs(getVal('battery_power')) > 10 }">
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
    <div class="card card--grid" :class="{ 'card--active': Math.abs(getVal('grid_power')) > 10 }">
      <div class="card-header">
        <span class="card-title">⚡ Grid Power</span>
        <span class="icon-glow" :class="{ 'icon-glow--grid-active': Math.abs(getVal('grid_power')) > 10 }">⚡</span>
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
        <div class="sub-item" :class="{ 'sub-item--active-grid': getVal('grid_power') < -10 }">
          <span class="sub-label">Export</span>
          <span class="sub-val">{{
            formatWOrKW(getVal("grid_export_power"))
          }}</span>
        </div>
        <div class="sub-item" :class="{ 'sub-item--active-grid': getVal('grid_power') > 10 }">
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
    <div class="card card--load" :class="{ 'card--active': getVal('smart_load_power') > 10 || getVal('light_load_power') > 10 || getVal('load_power') > 10 }">
      <div class="card-header">
        <span class="card-title">🧠 Smart Load Power</span>
        <span class="icon-glow" :class="{ 'icon-glow--load-active': getVal('smart_load_power') > 10 || getVal('light_load_power') > 10 || getVal('load_power') > 10 }">🧠</span>
      </div>
      <div class="card-value-wrapper">
        <span class="card-value">{{ formatPower(getVal("smart_load_power")) }}</span>
        <span class="card-unit">{{ getPowerUnit(getVal("smart_load_power")) }}</span>
        <span class="card-details-inline" :class="{ 'inline-details--active': getVal('smart_load_power') > 10 }">
          {{ getVal("load_voltage").toFixed(0) }}V / {{ calculateCurrent(getVal("smart_load_power")).toFixed(1) }}A
        </span>
      </div>
      <div class="card-sub grid-sub-items">
        <div class="sub-item" :class="{ 'sub-item--active-load': getVal('light_load_power') > 10 }">
          <span class="sub-label">Light Load</span>
          <span class="sub-val">
            {{ formatWOrKW(getVal("light_load_power")) }}
            <span class="sub-details">{{ getVal("load_voltage").toFixed(0) }}V / {{
              calculateCurrent(getVal("light_load_power")).toFixed(1) }}A</span>
          </span>
        </div>
        <div class="sub-item" :class="{ 'sub-item--active-load': getVal('load_power') > 10 }">
          <span class="sub-label">Load</span>
          <span class="sub-val">
            {{ formatWOrKW(getVal("load_power")) }}
            <span class="sub-details">{{ getVal("load_voltage").toFixed(0) }}V / {{ getVal("load_current").toFixed(1) }}A</span>
          </span>
        </div>
        <div class="sub-item" :class="{ 'sub-item--active-load': getVal('load_power') > 10 }">
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

/* Active state indicators & animations */
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse-icon {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
    filter: drop-shadow(0 0 2px currentColor);
  }
  50% {
    transform: scale(1.15);
    opacity: 1;
    filter: drop-shadow(0 0 10px currentColor);
  }
}

@keyframes flicker-icon {
  0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 2px currentColor); }
  50% { opacity: 1; filter: drop-shadow(0 0 12px currentColor); }
  70% { opacity: 0.8; filter: drop-shadow(0 0 6px currentColor); }
}

@keyframes pulse-card-solar {
  0%, 100% { box-shadow: var(--shadow-card); border-color: var(--border); }
  50% { box-shadow: var(--shadow-card), 0 0 15px var(--solar-glow); border-color: rgba(245, 158, 11, 0.4); }
}
@keyframes pulse-card-battery {
  0%, 100% { box-shadow: var(--shadow-card); border-color: var(--border); }
  50% { box-shadow: var(--shadow-card), 0 0 15px var(--battery-glow); border-color: rgba(16, 185, 129, 0.4); }
}
@keyframes pulse-card-grid {
  0%, 100% { box-shadow: var(--shadow-card); border-color: var(--border); }
  50% { box-shadow: var(--shadow-card), 0 0 15px var(--grid-glow); border-color: rgba(99, 102, 241, 0.4); }
}
@keyframes pulse-card-load {
  0%, 100% { box-shadow: var(--shadow-card); border-color: var(--border); }
  50% { box-shadow: var(--shadow-card), 0 0 15px var(--load-glow); border-color: rgba(244, 63, 94, 0.4); }
}

/* Card active styles */
.card--solar.card--active {
  animation: pulse-card-solar 3s infinite ease-in-out;
}
.card--battery.card--active {
  animation: pulse-card-battery 3s infinite ease-in-out;
}
.card--grid.card--active {
  animation: pulse-card-grid 3s infinite ease-in-out;
}
.card--load.card--active {
  animation: pulse-card-load 3s infinite ease-in-out;
}

/* Icon active states */
.icon-glow--solar-active {
  animation: spin-slow 12s linear infinite, pulse-icon 2s infinite ease-in-out;
  color: var(--solar);
  opacity: 1 !important;
}
.icon-glow--battery-active {
  animation: pulse-icon 2s infinite ease-in-out;
  color: var(--battery);
  opacity: 1 !important;
}
.icon-glow--grid-active {
  animation: flicker-icon 1.5s infinite ease-in-out;
  color: var(--grid);
  opacity: 1 !important;
}
.icon-glow--load-active {
  animation: pulse-icon 2s infinite ease-in-out;
  color: var(--load);
  opacity: 1 !important;
}

/* Inline detail active state */
.inline-details--active {
  color: var(--load) !important;
  background: rgba(244, 63, 94, 0.1) !important;
  border: 1px solid rgba(244, 63, 94, 0.15);
}

/* Sub-item active status text shadow & coloring */
.sub-item--active-solar .sub-val {
  color: var(--solar) !important;
  text-shadow: 0 0 8px var(--solar-glow);
  transition: all 0.3s ease;
}
.sub-item--active-battery .sub-val {
  color: var(--battery) !important;
  text-shadow: 0 0 8px var(--battery-glow);
  transition: all 0.3s ease;
}
.sub-item--active-grid .sub-val {
  color: var(--grid) !important;
  text-shadow: 0 0 8px var(--grid-glow);
  transition: all 0.3s ease;
}
.sub-item--active-load .sub-val {
  color: var(--load) !important;
  text-shadow: 0 0 8px var(--load-glow);
  transition: all 0.3s ease;
}
</style>
