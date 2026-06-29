<template>
  <div class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 animate-fadeInUp">
    <!-- Solar Power Card -->
    <BasePowerCard
      title="Solar Power"
      icon="☀️"
      :value="formatPower(getVal('live_pv_total_power'))"
      :unit="getPowerUnit(getVal('live_pv_total_power'))"
      color="solar"
      :isActive="getVal('live_pv_total_power') > 10"
    >
      <template #sub-items>
        <BaseSubItem
          label="PV1"
          :value="formatWOrKW(getVal('pv1_power'))"
          :details="`${getVal('pv1_voltage').toFixed(0)}V / ${getVal('pv1_current').toFixed(1)}A`"
          color="solar"
          :isActive="getVal('pv1_power') > 10"
        />
        <BaseSubItem
          label="PV2"
          :value="formatWOrKW(getVal('pv2_power'))"
          :details="`${getVal('pv2_voltage').toFixed(0)}V / ${getVal('pv2_current').toFixed(1)}A`"
          color="solar"
          :isActive="getVal('pv2_power') > 10"
        />
        <BaseSubItem
          v-if="getVal('pv3_power') > 0 || getVal('pv3_voltage') > 0"
          label="PV3"
          :value="formatWOrKW(getVal('pv3_power'))"
          :details="`${getVal('pv3_voltage').toFixed(0)}V / ${getVal('pv3_current').toFixed(1)}A`"
          color="solar"
          :isActive="getVal('pv3_power') > 10"
        />
      </template>
    </BasePowerCard>

    <!-- Battery Power Card -->
    <BasePowerCard
      title="Battery Power"
      icon="🔋"
      :value="formatPower(Math.abs(getVal('battery_power')))"
      :unit="getPowerUnit(Math.abs(getVal('battery_power')))"
      color="battery"
      :isActive="Math.abs(getVal('battery_power')) > 10"
    >
      <template #inline-details>
        <span
          class="ml-auto text-[0.65rem] font-bold uppercase px-1.5 py-0.5 rounded tracking-[0.05em] self-center"
          :class="getBatteryDirectionClass()"
        >
          {{ getBatteryDirectionText() }}
        </span>
      </template>
      <template #sub-items>
        <BaseSubItem
          label="SOC"
          :value="`${getVal('battery_soc')}%`"
          color="battery"
          :isActive="Math.abs(getVal('battery_power')) > 10"
        />
        <BaseSubItem
          label="Voltage"
          :value="`${getVal('battery_voltage').toFixed(1)}V`"
        />
        <BaseSubItem
          label="Current"
          :value="`${getVal('battery_current').toFixed(1)}A`"
        />
      </template>
    </BasePowerCard>

    <!-- Grid Power Card -->
    <BasePowerCard
      title="Grid Power"
      icon="⚡"
      :value="formatPower(Math.abs(getVal('grid_power')))"
      :unit="getPowerUnit(Math.abs(getVal('grid_power')))"
      color="grid"
      :isActive="Math.abs(getVal('grid_power')) > 10"
    >
      <template #inline-details>
        <span
          class="ml-auto text-[0.65rem] font-bold uppercase px-1.5 py-0.5 rounded tracking-[0.05em] self-center"
          :class="getGridDirectionClass()"
        >
          {{ getGridDirectionText() }}
        </span>
      </template>
      <template #sub-items>
        <BaseSubItem
          label="Export"
          :value="formatWOrKW(getVal('grid_export_power'))"
          color="grid"
          :isActive="getVal('grid_power') < -10"
        />
        <BaseSubItem
          label="Import Today"
          :value="`${getVal('energy_import_today').toFixed(1)} kWh`"
          color="grid"
          :isActive="getVal('grid_power') > 10"
        />
        <BaseSubItem
          label="Details"
          :value="`${getVal('load_voltage').toFixed(0)}V / ${calculateCurrent(Math.abs(getVal('grid_power'))).toFixed(1)}A`"
          :details="`${getVal('grid_frequency').toFixed(1)}Hz`"
        />
      </template>
    </BasePowerCard>

    <!-- Smart Load Card -->
    <BasePowerCard
      title="Smart Load Power"
      icon="🧠"
      :value="formatPower(getVal('smart_load_power'))"
      :unit="getPowerUnit(getVal('smart_load_power'))"
      color="load"
      :isActive="getVal('smart_load_power') > 10 || getVal('light_load_power') > 10 || getVal('load_power') > 10"
    >
      <template #inline-details>
        <span
          class="ml-auto text-[0.8rem] font-semibold text-text-muted bg-white/5 px-2 py-0.5 rounded-[6px] self-center transition-colors duration-300"
          :class="{ 'text-load bg-load/10 border border-load/15': getVal('smart_load_power') > 10 }"
        >
          {{ getVal('load_voltage').toFixed(0) }}V / {{ calculateCurrent(getVal('smart_load_power')).toFixed(1) }}A / {{ getVal('grid_frequency').toFixed(1) }}Hz
        </span>
      </template>
      <template #sub-items>
        <BaseSubItem
          label="Light Load"
          :value="formatWOrKW(getVal('light_load_power'))"
          :details="`${getVal('load_voltage').toFixed(0)}V / ${calculateCurrent(getVal('light_load_power')).toFixed(1)}A / ${getVal('grid_frequency').toFixed(1)}Hz`"
          color="load"
          :isActive="getVal('light_load_power') > 10"
        />
        <BaseSubItem
          label="Load"
          :value="formatWOrKW(getVal('load_power'))"
          :details="`${getVal('load_voltage').toFixed(0)}V / ${getVal('load_current').toFixed(1)}A / ${getVal('grid_frequency').toFixed(1)}Hz`"
          color="load"
          :isActive="getVal('load_power') > 10"
        />
        <BaseSubItem
          label="UPS (Heavy)"
          :value="`${getVal('load_voltage').toFixed(0)}V / ${getVal('load_current').toFixed(1)}A`"
          :details="`${getVal('grid_frequency').toFixed(1)}Hz`"
          color="load"
          :isActive="getVal('load_power') > 10"
        />
      </template>
    </BasePowerCard>
  </div>
</template>

<script setup lang="ts">
import { useMetrics } from "~/composables/useMetrics";
import BasePowerCard from "./BasePowerCard.vue";
import BaseSubItem from "./BaseSubItem.vue";

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
  if (pwr > 10) return "bg-load/15 text-load";
  if (pwr < -10) return "bg-battery/15 text-battery";
  return "bg-white/5 text-text-muted";
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
  if (pwr > 10) return "bg-grid/15 text-grid";
  if (pwr < -10) return "bg-solar/15 text-solar";
  return "bg-white/5 text-text-muted";
}

function getGridDirectionText(): string {
  const pwr = getVal("grid_power");
  if (pwr > 10) return "Importing";
  if (pwr < -10) return "Exporting";
  return "Online";
}
</script>
