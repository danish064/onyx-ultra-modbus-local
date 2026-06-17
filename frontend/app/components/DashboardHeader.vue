<template>
  <header class="dashboard-header fade-in-up">
    <div class="header-left">
      <span class="header-icon">☀️</span>
      <h1 class="header-title">SolarMax Onyx PV 9000</h1>
    </div>

    <div class="header-center">
      <span
        class="status-dot"
        :class="isConnected ? 'status-dot--live' : 'status-dot--error'"
      ></span>
      <span class="status-text">{{
        isConnected ? "Connected" : "Disconnected"
      }}</span>
      <span class="poll-badge" v-if="isConnected">Polls: {{ pollCount }}</span>
      <span class="error-badge" v-if="!isConnected && error">{{ error }}</span>
    </div>

    <div class="header-right">
      <span class="timestamp" v-if="timestamp"
        >Last Updated: {{ formatTime(timestamp) }}</span
      >
      <button class="refresh-btn" @click="fetchMetrics" :disabled="isLoading">
        <span v-if="isLoading" class="spinner"></span>
        <span v-else>Refresh</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useMetrics } from "~/composables/useMetrics";

const { isConnected, timestamp, isLoading, fetchMetrics, pollCount, error } =
  useMetrics();

function formatTime(tsString: string): string {
  if (!tsString) return "";
  try {
    const date = new Date(tsString);
    return date.toLocaleTimeString("en-US", { hour12: false });
  } catch (e) {
    return tsString;
  }
}
</script>

<style scoped>
.dashboard-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 64px;
  padding: 0 24px;
  background: rgba(10, 14, 26, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  font-size: 1.4rem;
}

.header-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.01em;
}

.header-center {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  padding: 6px 14px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border);
}

.status-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-right: 12px;
}

.poll-badge {
  font-size: 0.7rem;
  font-weight: 700;
  background: rgba(99, 102, 241, 0.15);
  color: var(--grid);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.error-badge {
  font-size: 0.7rem;
  font-weight: 600;
  background: rgba(248, 113, 113, 0.1);
  color: var(--danger);
  padding: 2px 8px;
  margin-left: 8px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(248, 113, 113, 0.2);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.timestamp {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.refresh-btn {
  background: linear-gradient(135deg, var(--solar), #d97706);
  color: white;
  border: none;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition:
    transform 0.2s,
    opacity 0.2s,
    box-shadow 0.2s;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(245, 158, 11, 0.3);
}

.refresh-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 12px;
  height: 12px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin-slow 1s linear infinite;
}

@media (max-width: 640px) {
  .header-center {
    display: none;
  }
}
</style>
