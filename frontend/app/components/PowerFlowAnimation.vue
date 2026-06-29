<template>
  <div class="bg-card border border-border rounded-[16px] p-6 shadow-card animate-fadeInUp">
    <div class="flex items-center gap-3 mb-5 pb-3 border-b border-border">
      <span class="text-[1.4rem]">🔌</span>
      <h2 class="text-[1.1rem] font-bold tracking-[-0.01em]">Live Power Flow & Distribution</h2>
      <span class="ml-auto text-[0.7rem] font-semibold uppercase tracking-[0.06em] px-2.5 py-1 rounded-full bg-success shadow-[0_0_8px_theme(colors.success)] animate-[pulse-glow_2s_ease-in-out_infinite] text-white">Active</span>
    </div>

    <div class="relative w-full overflow-hidden">
      <svg viewBox="0 0 1600 500" class="w-full h-auto block">
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
        <path d="M 800,50 L 800,250" class="fill-none stroke-white/[0.04] stroke-[4px]" />

        <!-- Battery to Inverter (Horizontal Left-to-Right) -->
        <path d="M 250,250 L 800,250" class="fill-none stroke-white/[0.04] stroke-[4px]" />

        <!-- Grid to Inverter (Horizontal Right-to-Left) -->
        <path d="M 800,250 L 1500,250" class="fill-none stroke-white/[0.04] stroke-[4px]" />

        <!-- UPS (Heavy) - Tapped from Grid-to-Inverter Line at x=1350, going UP to y=90 -->
        <path d="M 1350,250 L 1350,90" class="fill-none stroke-white/[0.04] stroke-[4px]" />

        <!-- Load - Tapped from Grid-to-Inverter Line at x=1350, going DOWN to y=410 -->
        <path d="M 1350,250 L 1350,410" class="fill-none stroke-white/[0.04] stroke-[4px]" />

        <!-- Light Load (Curved Down-Left from Inverter) -->
        <path d="M 800,250 C 800,320 700,320 700,410" class="fill-none stroke-white/[0.04] stroke-[4px]" />

        <!-- Smart Load (Curved Down-Right from Inverter) -->
        <path d="M 800,250 C 800,320 900,320 900,410" class="fill-none stroke-white/[0.04] stroke-[4px]" />


        <!-- Dynamic Animated Flows -->
        <!-- Solar Flow (PV to Inverter) -->
        <path v-if="pvPower > 10" d="M 800,50 L 800,250" class="fill-none stroke-[4px] [stroke-linecap:round] [stroke-dasharray:8_16] animate-[flow_4s_linear_infinite] stroke-solar" style="filter: url(#glow-solar);"
          :style="{ animationDuration: getFlowDuration(pvPower) }" />

        <!-- Battery Flow (Battery to Inverter [Discharging] or Inverter to Battery [Charging]) -->
        <path v-if="Math.abs(batteryPower) > 10" d="M 250,250 L 800,250" class="fill-none stroke-[4px] [stroke-linecap:round] [stroke-dasharray:8_16] animate-[flow_4s_linear_infinite] stroke-battery" style="filter: url(#glow-battery);"
          :class="{ '[animation-direction:reverse]': batteryPower < 0 }"
          :style="{ animationDuration: getFlowDuration(Math.abs(batteryPower)) }" />

        <!-- Grid Flow (Grid to Inverter [Import] or Inverter to Grid [Export]) -->
        <path v-if="Math.abs(gridPower) > 10" d="M 800,250 L 1500,250" class="fill-none stroke-[4px] [stroke-linecap:round] [stroke-dasharray:8_16] animate-[flow_4s_linear_infinite] stroke-grid" style="filter: url(#glow-grid);"
          :class="{ '[animation-direction:reverse]': gridPower >= 0 }"
          :style="{ animationDuration: getFlowDuration(Math.abs(gridPower)) }" />

        <!-- UPS (Heavy) Flow (from T-junction at (1350, 250) up to node at (1350, 90)) -->
        <path v-if="loadPower > 10" d="M 1350,250 L 1350,90" class="fill-none stroke-[4px] [stroke-linecap:round] [stroke-dasharray:8_16] animate-[flow_4s_linear_infinite] stroke-load" style="filter: url(#glow-load);"
          :style="{ animationDuration: getFlowDuration(loadPower) }" />

        <!-- Load Flow (from T-junction at (1350, 250) down to node at (1350, 410)) -->
        <path v-if="loadPower > 10" d="M 1350,250 L 1350,410" class="fill-none stroke-[4px] [stroke-linecap:round] [stroke-dasharray:8_16] animate-[flow_4s_linear_infinite] stroke-load" style="filter: url(#glow-load);"
          :style="{ animationDuration: getFlowDuration(loadPower) }" />

        <!-- Light Load Flow (Inverter to Light Load) -->
        <path v-if="lightLoadPower > 10" d="M 800,250 C 800,320 700,320 700,410"
          class="fill-none stroke-[4px] [stroke-linecap:round] [stroke-dasharray:8_16] animate-[flow_4s_linear_infinite] stroke-load" style="filter: url(#glow-load);" :style="{ animationDuration: getFlowDuration(lightLoadPower) }" />

        <!-- Smart Load Flow (Inverter to Smart Load) -->
        <path v-if="smartLoadPower > 10" d="M 800,250 C 800,320 900,320 900,410"
          class="fill-none stroke-[4px] [stroke-linecap:round] [stroke-dasharray:8_16] animate-[flow_4s_linear_infinite] stroke-load" style="filter: url(#glow-load);" :style="{ animationDuration: getFlowDuration(smartLoadPower) }" />


        <!-- HTML Overlay Nodes using foreignObject -->
        <!-- SOLAR NODE (Top Center) -->
        <foreignObject x="725" y="10" width="150" height="80">
          <div class="flex items-center gap-1.5 p-1 bg-[#1a2235]/75 border border-white/5 rounded-md shadow-card h-[calc(100%-4px)] mt-[2px] backdrop-blur-[10px] transition-all duration-300 border-l-[3px] border-l-solar" :class="{ 'animate-[pulse-solar-node_2.5s_infinite_ease-in-out]': pvPower > 10 }">
            <div class="text-[1.4rem] flex items-center justify-center">☀️</div>
            <div class="flex flex-col justify-center">
              <span class="text-[0.9rem] text-text-muted uppercase font-semibold tracking-[0.05em]">Solar</span>
              <span class="text-[1.1rem] font-bold text-text-primary">{{ formatWOrKW(pvPower) }}</span>
            </div>
          </div>
        </foreignObject>

        <!-- BATTERY NODE (Middle Left) -->
        <foreignObject x="175" y="210" width="150" height="80">
          <div class="flex items-center gap-1.5 p-1 bg-[#1a2235]/75 border border-white/5 rounded-md shadow-card h-[calc(100%-4px)] mt-[2px] backdrop-blur-[10px] transition-all duration-300 border-l-[3px] border-l-battery" :class="{ 'animate-[pulse-battery-node_2.5s_infinite_ease-in-out]': Math.abs(batteryPower) > 10 }">
            <div class="text-[1.4rem] flex items-center justify-center">🔋</div>
            <div class="flex flex-col justify-center">
              <span class="text-[0.9rem] text-text-muted uppercase font-semibold tracking-[0.05em]">Battery</span>
              <span class="text-[1.1rem] font-bold text-text-primary">{{ formatWOrKW(Math.abs(batteryPower)) }}</span>
              <span class="text-[0.9rem] text-text-secondary font-medium mt-[1px]">{{ batteryPower >= 0 ? 'Discharging' : 'Charging' }} ({{ batterySoc
              }}%)</span>
            </div>
          </div>
        </foreignObject>

        <!-- GRID NODE (Middle Right) -->
        <foreignObject x="1425" y="190" width="200" height="120">
          <div class="flex items-center gap-1.5 p-1 bg-[#1a2235]/75 border border-white/5 rounded-md shadow-card h-[calc(100%-4px)] mt-[2px] backdrop-blur-[10px] transition-all duration-300 border-l-[3px] border-l-grid"
            :class="{ 'animate-[pulse-grid-node_2.5s_infinite_ease-in-out]': Math.abs(gridPower) > 10 }">
            <div class="text-[1.4rem] flex items-center justify-center">⚡</div>
            <div class="flex flex-col justify-center">
              <span class="text-[0.9rem] text-text-muted uppercase font-semibold tracking-[0.05em]">Grid</span>
              <span class="text-[1.1rem] font-bold text-text-primary">{{ formatWOrKW(Math.abs(gridPower)) }}</span>
              <span class="text-[0.9rem] text-text-secondary font-medium mt-[1px]" style="text-wrap: nowrap;">{{ gridPower >= 0 ? 'Importing' : 'Exporting' }} <br> {{ loadVoltage.toFixed(0) }}V / {{ calculateCurrent(Math.abs(gridPower)).toFixed(1) }}A / {{ gridFrequency.toFixed(1) }}Hz</span>
            </div>
          </div>
        </foreignObject>

        <!-- UPS (Heavy) NODE (Top Right-Center, above Grid Line) -->
        <foreignObject x="1275" y="50" width="200" height="100">
          <div class="flex items-center gap-1.5 p-1 bg-[#1a2235]/75 border border-white/5 rounded-md shadow-card h-[calc(100%-4px)] mt-[2px] backdrop-blur-[10px] transition-all duration-300 border-l-[3px] border-l-load" :class="{ 'animate-[pulse-load-node_2.5s_infinite_ease-in-out]': loadPower > 10 }">
            <div class="text-[1.4rem] flex items-center justify-center">🔌</div>
            <div class="flex flex-col justify-center">
              <span class="text-[0.9rem] text-text-muted uppercase font-semibold tracking-[0.05em]">UPS (Heavy)</span>
              <span class="text-[1.1rem] font-bold text-text-primary">{{ formatWOrKW(loadPower) }}</span>
              <span class="text-[0.9rem] text-text-secondary font-medium mt-[1px]" style="text-wrap: nowrap;">{{ loadVoltage.toFixed(0) }}V / {{
                loadCurrent.toFixed(1) }}A / {{
                  gridFrequency.toFixed(1) }}Hz</span>
            </div>
          </div>
        </foreignObject>

        <!-- LOAD NODE (Bottom Right-Center, below Grid Line) -->
        <foreignObject x="1275" y="370" width="200" height="100">
          <div class="flex items-center gap-1.5 p-1 bg-[#1a2235]/75 border border-white/5 rounded-md shadow-card h-[calc(100%-4px)] mt-[2px] backdrop-blur-[10px] transition-all duration-300 border-l-[3px] border-l-load" :class="{ 'animate-[pulse-load-node_2.5s_infinite_ease-in-out]': loadPower > 10 }">
            <div class="text-[1.4rem] flex items-center justify-center">🏠</div>
            <div class="flex flex-col justify-center">
              <span class="text-[0.9rem] text-text-muted uppercase font-semibold tracking-[0.05em]">Load</span>
              <span class="text-[1.1rem] font-bold text-text-primary">{{ formatWOrKW(loadPower) }}</span>
              <span class="text-[0.9rem] text-text-secondary font-medium mt-[1px]" style="text-wrap: nowrap;">{{ loadVoltage.toFixed(0) }}V / {{
                loadCurrent.toFixed(1) }}A / {{
                  gridFrequency.toFixed(1) }}Hz</span>
            </div>
          </div>
        </foreignObject>

        <!-- INVERTER (CENTER NODE) -->
        <foreignObject x="730" y="180" width="140" height="140">
          <div class="w-full h-full flex items-center justify-center" :class="{ '[&>div]:border-info [&>div]:shadow-[0_0_25px_rgba(56,189,248,0.25),inset_0_0_15px_rgba(56,189,248,0.25)] [&>div]:animate-[pulse-ring_2s_ease-in-out_infinite]': hasPowerFlow }">
            <div class="w-[120px] h-[120px] rounded-full bg-[radial-gradient(circle,theme(colors.card.DEFAULT)_60%,rgba(56,189,248,0.08)_100%)] border border-info/20 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.05)] transition-all duration-500">
              <div class="flex flex-col items-center text-center">
                <span class="text-[1.6rem] animate-[spin_12s_linear_infinite] inline-block text-info">⚙️</span>
                <span class="text-[0.75rem] font-bold text-text-primary mt-1">Inverter</span>
                <span class="text-[0.62rem] text-info font-semibold bg-info/10 px-1.5 py-[1px] rounded-full mt-[3px]">{{ opModeText }}</span>
              </div>
            </div>
          </div>
        </foreignObject>

        <!-- LIGHT LOAD NODE (Bottom Center-Left) -->
        <foreignObject x="570" y="370" width="200" height="100">
          <div class="flex items-center gap-1.5 p-1 bg-[#1a2235]/75 border border-white/5 rounded-md shadow-card h-[calc(100%-4px)] mt-[2px] backdrop-blur-[10px] transition-all duration-300 border-l-[3px] border-l-load" :class="{ 'animate-[pulse-load-node_2.5s_infinite_ease-in-out]': lightLoadPower > 10 }">
            <div class="text-[1.4rem] flex items-center justify-center">💡</div>
            <div class="flex flex-col justify-center">
              <span class="text-[0.9rem] text-text-muted uppercase font-semibold tracking-[0.05em]">Light Load</span>
              <span class="text-[1.1rem] font-bold text-text-primary">{{ formatWOrKW(lightLoadPower) }}</span>
              <span class="text-[0.9rem] text-text-secondary font-medium mt-[1px]" style="text-wrap: nowrap;">{{ loadVoltage.toFixed(0) }}V / {{
                calculateCurrent(lightLoadPower).toFixed(1) }}A / {{ gridFrequency.toFixed(1) }}Hz</span>
            </div>
          </div>
        </foreignObject>

        <!-- SMART LOAD NODE (Bottom Center-Right) -->
        <foreignObject x="815" y="370" width="200" height="100">
          <div class="flex items-center gap-1.5 p-1 bg-[#1a2235]/75 border border-white/5 rounded-md shadow-card h-[calc(100%-4px)] mt-[2px] backdrop-blur-[10px] transition-all duration-300 border-l-[3px] border-l-load" :class="{ 'animate-[pulse-load-node_2.5s_infinite_ease-in-out]': smartLoadPower > 10 }">
            <div class="text-[1.4rem] flex items-center justify-center">🧠</div>
            <div class="flex flex-col justify-center">
              <span class="text-[0.9rem] text-text-muted uppercase font-semibold tracking-[0.05em]">Smart Load</span>
              <span class="text-[1.1rem] font-bold text-text-primary">{{ formatWOrKW(smartLoadPower) }}</span>
              <span class="text-[0.9rem] text-text-secondary font-medium mt-[1px]" style="text-wrap: nowrap;">{{ loadVoltage.toFixed(0) }}V / {{
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


