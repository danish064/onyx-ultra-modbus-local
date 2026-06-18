<template>
  <div class="card card--flow-anim fade-in-up">
    <div class="section-header">
      <span class="section-header__icon">🔌</span>
      <h2 class="section-header__title">Live Power Flow & Distribution</h2>
      <span class="section-header__badge status-dot--live">Active</span>
    </div>

    <div class="flow-visualization">
      <svg viewBox="0 0 1600 500" class="flow-svg">
        <!-- Define Filters for Neon Glow -->
        <defs>
          <filter id="glow-solar" filterUnits="userSpaceOnUse" x="-200" y="-200" width="2000" height="1000">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-grid" filterUnits="userSpaceOnUse" x="-200" y="-200" width="2000" height="1000">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-battery" filterUnits="userSpaceOnUse" x="-200" y="-200" width="2000" height="1000">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-load" filterUnits="userSpaceOnUse" x="-200" y="-200" width="2000" height="1000">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Base Background Connections (Static Lines) -->
        <!-- Solar to Inverter (Vertical Down) -->
        <path d="M 800,50 L 800,250" class="connection-base" />

        <!-- Battery to Inverter (Horizontal Left-to-Right) -->
        <path d="M 250,250 L 800,250" class="connection-base" />

        <!-- Grid to Inverter (Horizontal Right-to-Left) -->
        <path d="M 800,250 L 1500,250" class="connection-base" />

        <!-- UPS (Heavy) - Tapped from Grid-to-Inverter Line at x=1350, going UP to y=90 -->
        <path d="M 1350,250 L 1350,90" class="connection-base" />

        <!-- Load - Tapped from Grid-to-Inverter Line at x=1350, going DOWN to y=410 -->
        <path d="M 1350,250 L 1350,410" class="connection-base" />

        <!-- Light Load (Curved Down-Left from Inverter) -->
        <path d="M 800,250 C 800,320 700,320 700,410" class="connection-base" />

        <!-- Smart Load (Curved Down-Right from Inverter) -->
        <path d="M 800,250 C 800,320 900,320 900,410" class="connection-base" />


        <!-- Dynamic Animated Flows -->
        <!-- Solar Flow (PV to Inverter) -->
        <path v-if="pvPower > 10" d="M 800,50 L 800,250" class="connection-active connection-solar"
          :style="{ animationDuration: getFlowDuration(pvPower) }" />

        <!-- Battery Flow (Battery to Inverter [Discharging] or Inverter to Battery [Charging]) -->
        <path v-if="Math.abs(batteryPower) > 10" d="M 250,250 L 800,250" class="connection-active connection-battery"
          :class="{ 'flow-reverse': batteryPower < 0 }"
          :style="{ animationDuration: getFlowDuration(Math.abs(batteryPower)) }" />

        <!-- Grid Flow (Grid to Inverter [Import] or Inverter to Grid [Export]) -->
        <path v-if="Math.abs(gridPower) > 10" d="M 800,250 L 1500,250" class="connection-active connection-grid"
          :class="{ 'flow-reverse': gridPower >= 0 }"
          :style="{ animationDuration: getFlowDuration(Math.abs(gridPower)) }" />

        <!-- UPS (Heavy) Flow (from T-junction at (1350, 250) up to node at (1350, 90)) -->
        <path v-if="loadPower > 10" d="M 1350,250 L 1350,90" class="connection-active connection-load"
          :style="{ animationDuration: getFlowDuration(loadPower) }" />

        <!-- Load Flow (from T-junction at (1350, 250) down to node at (1350, 410)) -->
        <path v-if="loadPower > 10" d="M 1350,250 L 1350,410" class="connection-active connection-load"
          :style="{ animationDuration: getFlowDuration(loadPower) }" />

        <!-- Light Load Flow (Inverter to Light Load) -->
        <path v-if="lightLoadPower > 10" d="M 800,250 C 800,320 700,320 700,410"
          class="connection-active connection-load" :style="{ animationDuration: getFlowDuration(lightLoadPower) }" />

        <!-- Smart Load Flow (Inverter to Smart Load) -->
        <path v-if="smartLoadPower > 10" d="M 800,250 C 800,320 900,320 900,410"
          class="connection-active connection-load" :style="{ animationDuration: getFlowDuration(smartLoadPower) }" />


        <!-- HTML Overlay Nodes using foreignObject -->
        <!-- SOLAR NODE (Top Center) -->
        <foreignObject x="725" y="10" width="150" height="80">
          <div class="node-wrapper node--solar" :class="{ 'node--active': pvPower > 10 }">
            <div class="node-icon">☀️</div>
            <div class="node-body">
              <span class="node-title">Solar</span>
              <span class="node-val">{{ formatWOrKW(pvPower) }}</span>
            </div>
          </div>
        </foreignObject>

        <!-- BATTERY NODE (Middle Left) -->
        <foreignObject x="175" y="210" width="150" height="80">
          <div class="node-wrapper node--battery" :class="{ 'node--active': Math.abs(batteryPower) > 10 }">
            <div class="node-icon">🔋</div>
            <div class="node-body">
              <span class="node-title">Battery</span>
              <span class="node-val">{{ formatWOrKW(Math.abs(batteryPower)) }}</span>
              <span class="node-direction">{{ batteryPower >= 0 ? 'Discharging' : 'Charging' }} ({{ batterySoc
              }}%)</span>
            </div>
          </div>
        </foreignObject>

        <!-- GRID NODE (Middle Right) -->
        <foreignObject x="1425" y="190" width="200" height="120">
          <div class="node-wrapper node--grid"
            :class="{ 'node-glow--export': gridPower < 0, 'node--active': Math.abs(gridPower) > 10 }">
            <div class="node-icon">⚡</div>
            <div class="node-body">
              <span class="node-title">Grid</span>
              <span class="node-val">{{ formatWOrKW(Math.abs(gridPower)) }}</span>
              <span class="node-direction">{{ gridPower >= 0 ? 'Importing' : 'Exporting' }} <br> {{
                gridFrequency.toFixed(1) }}Hz</span>
            </div>
          </div>
        </foreignObject>

        <!-- UPS (Heavy) NODE (Top Right-Center, above Grid Line) -->
        <foreignObject x="1275" y="50" width="200" height="100">
          <div class="node-wrapper node--load" :class="{ 'node--active': loadPower > 10 }">
            <div class="node-icon">🔌</div>
            <div class="node-body">
              <span class="node-title">UPS (Heavy)</span>
              <span class="node-val">{{ formatWOrKW(loadPower) }}</span>
              <span class="node-direction" style="text-wrap: nowrap;">{{ loadVoltage.toFixed(0) }}V / {{
                loadCurrent.toFixed(1) }}A / {{
                  gridFrequency.toFixed(1) }}Hz</span>
            </div>
          </div>
        </foreignObject>

        <!-- LOAD NODE (Bottom Right-Center, below Grid Line) -->
        <foreignObject x="1275" y="370" width="200" height="100">
          <div class="node-wrapper node--load" :class="{ 'node--active': loadPower > 10 }">
            <div class="node-icon">🏠</div>
            <div class="node-body">
              <span class="node-title">Load</span>
              <span class="node-val">{{ formatWOrKW(loadPower) }}</span>
              <span class="node-direction" style="text-wrap: nowrap;">{{ loadVoltage.toFixed(0) }}V / {{
                loadCurrent.toFixed(1) }}A / {{
                  gridFrequency.toFixed(1) }}Hz</span>
            </div>
          </div>
        </foreignObject>

        <!-- INVERTER (CENTER NODE) -->
        <foreignObject x="730" y="180" width="140" height="140">
          <div class="inverter-node" :class="{ 'inverter-node--active': hasPowerFlow }">
            <div class="inverter-ring">
              <div class="inverter-core">
                <span class="inverter-logo">⚙️</span>
                <span class="inverter-label">Inverter</span>
                <span class="inverter-status">{{ opModeText }}</span>
              </div>
            </div>
          </div>
        </foreignObject>

        <!-- LIGHT LOAD NODE (Bottom Center-Left) -->
        <foreignObject x="570" y="370" width="200" height="100">
          <div class="node-wrapper node--load" :class="{ 'node--active': lightLoadPower > 10 }">
            <div class="node-icon">💡</div>
            <div class="node-body">
              <span class="node-title">Light Load</span>
              <span class="node-val">{{ formatWOrKW(lightLoadPower) }}</span>
              <span class="node-direction" style="text-wrap: nowrap;">{{ loadVoltage.toFixed(0) }}V / {{
                calculateCurrent(lightLoadPower).toFixed(1) }}A / {{ gridFrequency.toFixed(1) }}Hz</span>
            </div>
          </div>
        </foreignObject>

        <!-- SMART LOAD NODE (Bottom Center-Right) -->
        <foreignObject x="815" y="370" width="200" height="100">
          <div class="node-wrapper node--load" :class="{ 'node--active': smartLoadPower > 10 }">
            <div class="node-icon">🧠</div>
            <div class="node-body">
              <span class="node-title">Smart Load</span>
              <span class="node-val">{{ formatWOrKW(smartLoadPower) }}</span>
              <span class="node-direction" style="text-wrap: nowrap;">{{ loadVoltage.toFixed(0) }}V / {{
                calculateCurrent(smartLoadPower).toFixed(1) }}A / {{ gridFrequency.toFixed(1) }}Hz</span>
            </div>
          </div>
        </foreignObject>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMetrics } from '~/composables/useMetrics';

const { getVal } = useMetrics();

const pvPower = computed(() => getVal('live_pv_total_power'));
const gridPower = computed(() => getVal('grid_power'));
const batteryPower = computed(() => getVal('battery_power'));
const batterySoc = computed(() => getVal('battery_soc'));
const loadPower = computed(() => getVal('load_power'));
const loadVoltage = computed(() => getVal('load_voltage'));
const loadCurrent = computed(() => getVal('load_current'));
const lightLoadPower = computed(() => getVal('light_load_power'));
const smartLoadPower = computed(() => getVal('smart_load_power'));
const gridFrequency = computed(() => getVal('grid_frequency'));

const hasPowerFlow = computed(() => {
  return (
    pvPower.value > 10 ||
    Math.abs(gridPower.value) > 10 ||
    Math.abs(batteryPower.value) > 10 ||
    loadPower.value > 10 ||
    lightLoadPower.value > 10 ||
    smartLoadPower.value > 10
  );
});

const opModeText = computed(() => {
  const mode = getVal("inverter_operation_mode_raw");
  switch (mode) {
    case 0: return "Self Used";
    case 1: return "Feed-in";
    case 2: return "Time Ctrl";
    case 3: return "Back-up";
    default: return "Online";
  }
});

function formatWOrKW(val: number): string {
  if (val >= 1000) {
    return (val / 1000).toFixed(2) + ' kW';
  }
  return val.toFixed(0) + ' W';
}

function calculateCurrent(powerW: number): number {
  const v = loadVoltage.value;
  if (v <= 10) return 0;
  return powerW / v;
}

// Map power magnitude (watts) to flow speed (duration seconds)
// Higher power -> faster animation (smaller duration)
function getFlowDuration(watts: number): string {
  if (watts <= 10) return '0s';
  const clamped = Math.max(10, Math.min(10000, watts));
  // Map 10W -> 6s, 10000W -> 0.8s
  const duration = 6 - (Math.log10(clamped) / 4) * 5.2;
  return `${Math.max(0.6, duration).toFixed(2)}s`;
}
</script>

<style scoped>
.card--flow-anim {
  padding: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.flow-visualization {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.flow-svg {
  width: 100%;
  height: auto;
  display: block;
}

/* Connection Paths */
.connection-base {
  fill: none;
  stroke: rgba(255, 255, 255, 0.04);
  stroke-width: 4px;
}

.connection-active {
  fill: none;
  stroke-width: 4px;
  stroke-linecap: round;
  stroke-dasharray: 8 16;
  animation: flow 4s linear infinite;
}

.connection-solar {
  stroke: var(--solar);
  filter: url(#glow-solar);
}

.connection-grid {
  stroke: var(--grid);
  filter: url(#glow-grid);
}

.connection-battery {
  stroke: var(--battery);
  filter: url(#glow-battery);
}

.connection-load {
  stroke: var(--load);
  filter: url(#glow-load);
}

/* Reverse flow animation for battery charging or grid export */
.flow-reverse {
  animation-direction: reverse;
}

@keyframes flow {
  from {
    stroke-dashoffset: 48;
  }

  to {
    stroke-dashoffset: 0;
  }
}

/* Nodes Wrapper Style */
.node-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 4px;
  background: rgba(26, 34, 53, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  height: calc(100% - 4px);
  margin-top: 2px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.node-icon {
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.node-title {
  font-size: 0.9rem;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.node-val {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.node-direction {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin-top: 1px;
}

/* Color Accents for Node Outlines & Active Glow Animations */
@keyframes pulse-solar-node {

  0%,
  100% {
    box-shadow: var(--shadow-card), 0 0 4px rgba(245, 158, 11, 0.15);
    border-color: rgba(245, 158, 11, 0.2);
  }

  50% {
    box-shadow: var(--shadow-card), 0 0 15px rgba(245, 158, 11, 0.45);
    border-color: rgba(245, 158, 11, 0.6);
  }
}

@keyframes pulse-battery-node {

  0%,
  100% {
    box-shadow: var(--shadow-card), 0 0 4px rgba(16, 185, 129, 0.15);
    border-color: rgba(16, 185, 129, 0.2);
  }

  50% {
    box-shadow: var(--shadow-card), 0 0 15px rgba(16, 185, 129, 0.45);
    border-color: rgba(16, 185, 129, 0.6);
  }
}

@keyframes pulse-grid-node {

  0%,
  100% {
    box-shadow: var(--shadow-card), 0 0 4px rgba(99, 102, 241, 0.15);
    border-color: rgba(99, 102, 241, 0.2);
  }

  50% {
    box-shadow: var(--shadow-card), 0 0 15px rgba(99, 102, 241, 0.45);
    border-color: rgba(99, 102, 241, 0.6);
  }
}

@keyframes pulse-load-node {

  0%,
  100% {
    box-shadow: var(--shadow-card), 0 0 4px rgba(244, 63, 94, 0.15);
    border-color: rgba(244, 63, 94, 0.2);
  }

  50% {
    box-shadow: var(--shadow-card), 0 0 15px rgba(244, 63, 94, 0.45);
    border-color: rgba(244, 63, 94, 0.6);
  }
}

.node--solar {
  border-left: 3px solid var(--solar);
}

.node--solar.node--active {
  animation: pulse-solar-node 2.5s infinite ease-in-out;
}

.node--solar .node-val {
  color: var(--solar);
}

.node--grid {
  border-left: 3px solid var(--grid);
}

.node--grid.node--active {
  animation: pulse-grid-node 2.5s infinite ease-in-out;
}

.node--grid .node-val {
  color: var(--grid);
}

.node--battery {
  border-left: 3px solid var(--battery);
}

.node--battery.node--active {
  animation: pulse-battery-node 2.5s infinite ease-in-out;
}

.node--battery .node-val {
  color: var(--battery);
}

.node--load {
  border-left: 3px solid var(--load);
}

.node--load.node--active {
  animation: pulse-load-node 2.5s infinite ease-in-out;
}

.node--load .node-val {
  color: var(--load);
}

/* Inverter Center Node */
.inverter-node {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inverter-ring {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--bg-card) 60%, rgba(56, 189, 248, 0.08) 100%);
  border: 1px solid rgba(56, 189, 248, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.05);
  transition: all 0.5s ease;
}

.inverter-core {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.inverter-logo {
  font-size: 1.6rem;
  animation: spin-slow 12s linear infinite;
  display: inline-block;
  color: var(--info);
}

.inverter-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-top: 4px;
}

.inverter-status {
  font-size: 0.62rem;
  color: var(--info);
  font-weight: 600;
  background: rgba(56, 189, 248, 0.1);
  padding: 1px 6px;
  border-radius: var(--radius-full);
  margin-top: 3px;
}

/* Active Ring Pulse Animation */
.inverter-node--active .inverter-ring {
  border-color: var(--info);
  box-shadow: 0 0 25px var(--info-glow), inset 0 0 15px var(--info-glow);
  animation: pulse-ring 2s ease-in-out infinite;
}

@keyframes pulse-ring {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.02);
  }
}
</style>
