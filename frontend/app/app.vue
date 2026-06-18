<template>
  <div class="dashboard-container">
    <DashboardHeader />

    <main class="dashboard-content">
      <!-- Power Flow grid (Top values) -->
      <PowerFlowCards />

      <!-- Live Power Flow Animation -->
      <PowerFlowAnimation />

      <!-- Side-by-side Layout for Detailed Stats and Charts -->
      <div class="dashboard-grid-2">
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

<style>
/* Global Imports & Reset override if necessary, styling is already loaded via nuxt.config */
.dashboard-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.dashboard-content {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}
</style>
