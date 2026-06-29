<template>
  <div class="min-h-screen flex flex-col">
    <DashboardHeader />

    <main class="flex-1 p-6 flex flex-col gap-6 max-w-[1400px] mx-auto w-full">
      <!-- Power Flow grid (Top values) -->
      <PowerFlowCards />

      <!-- Live Power Flow Animation -->
      <PowerFlowAnimation />

      <!-- Side-by-side Layout for Detailed Stats and Charts -->
      <div class="grid gap-5 grid-cols-1 lg:grid-cols-2">
        <BatteryStatus />
        <SystemInfo />
      </div>

      <!-- Trend Chart -->
      <PowerChart />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useMetrics } from "~/composables/useMetrics";
import DashboardHeader from "./components/DashboardHeader.vue";
import PowerFlowCards from "./components/PowerFlowCards.vue";
import PowerFlowAnimation from "./components/PowerFlowAnimation.vue";
import BatteryStatus from "./components/BatteryStatus.vue";
import SystemInfo from "./components/SystemInfo.vue";
import PowerChart from "./components/PowerChart.vue";

const { startPolling, stopPolling } = useMetrics();

onMounted(() => {
  // Start polling metrics every 5 seconds (5000ms) for high reactivity
  startPolling(5000);
});

onUnmounted(() => {
  stopPolling();
});
</script>


