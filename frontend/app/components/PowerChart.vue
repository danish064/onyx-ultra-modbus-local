<template>
  <div class="card card--info fade-in-up">
    <div class="section-header">
      <span class="section-header__icon">📈</span>
      <h2 class="section-header__title">Live Power Trends</h2>
      <div class="chart-toggles">
        <label class="toggle-item solar">
          <input type="checkbox" v-model="visibleSeries.solar" /> Solar
        </label>
        <label class="toggle-item battery">
          <input type="checkbox" v-model="visibleSeries.battery" /> Battery
        </label>
        <label class="toggle-item grid">
          <input type="checkbox" v-model="visibleSeries.grid" /> Grid
        </label>
        <label class="toggle-item load">
          <input type="checkbox" v-model="visibleSeries.load" /> Load
        </label>
        <label class="toggle-item light-load">
          <input type="checkbox" v-model="visibleSeries.lightLoad" /> Light Load
        </label>
        <label class="toggle-item smart-load">
          <input type="checkbox" v-model="visibleSeries.smartLoad" /> Smart Load
        </label>
      </div>
    </div>

    <div class="chart-container" v-if="history.timestamps.length > 0">
      <Line :data="chartData" :options="chartOptions" :plugins="[verticalLinePlugin]" />
    </div>
    <div class="chart-placeholder" v-else>
      <p>Awaiting live metrics to plot trend...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler,
} from "chart.js";
import { useMetrics } from "~/composables/useMetrics";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler
);

const { history } = useMetrics();

const visibleSeries = ref({
  solar: true,
  battery: true,
  grid: true,
  load: true,
  lightLoad: true,
  smartLoad: true,
});

// Custom plugin to draw a vertical line on hover
const verticalLinePlugin = {
  id: "verticalLine",
  afterDraw: (chart: any) => {
    if (chart.tooltip?._active?.length) {
      const activePoint = chart.tooltip._active[0];
      const ctx = chart.ctx;
      const x = activePoint.element.x;
      const topY = chart.scales.y.top;
      const bottomY = chart.scales.y.bottom;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)"; // dashed vertical line color
      ctx.setLineDash([4, 4]); // dashed line
      ctx.stroke();
      ctx.restore();
    }
  },
};

const chartData = computed(() => {
  const datasets = [];

  if (visibleSeries.value.solar) {
    datasets.push({
      label: "Solar (W)",
      data: [...history.value.solar],
      borderColor: "#f59e0b",
      backgroundColor: "rgba(245, 158, 11, 0.03)",
      fill: true,
      tension: 0.3,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointBackgroundColor: "#f59e0b",
      pointBorderColor: "#0a0e1a",
      pointBorderWidth: 2,
    });
  }

  if (visibleSeries.value.battery) {
    datasets.push({
      label: "Battery (W)",
      data: [...history.value.battery],
      borderColor: "#10b981",
      backgroundColor: "rgba(16, 185, 129, 0.03)",
      fill: true,
      tension: 0.3,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointBackgroundColor: "#10b981",
      pointBorderColor: "#0a0e1a",
      pointBorderWidth: 2,
    });
  }

  if (visibleSeries.value.grid) {
    datasets.push({
      label: "Grid (W)",
      data: [...history.value.grid],
      borderColor: "#6366f1",
      backgroundColor: "rgba(99, 102, 241, 0.03)",
      fill: true,
      tension: 0.3,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointBackgroundColor: "#6366f1",
      pointBorderColor: "#0a0e1a",
      pointBorderWidth: 2,
    });
  }

  if (visibleSeries.value.load) {
    datasets.push({
      label: "Load (W)",
      data: [...history.value.load],
      borderColor: "#f43f5e",
      backgroundColor: "rgba(244, 63, 94, 0.03)",
      fill: true,
      tension: 0.3,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointBackgroundColor: "#f43f5e",
      pointBorderColor: "#0a0e1a",
      pointBorderWidth: 2,
    });
  }

  if (visibleSeries.value.lightLoad) {
    datasets.push({
      label: "Light Load (W)",
      data: [...history.value.lightLoad],
      borderColor: "#38bdf8",
      backgroundColor: "rgba(56, 189, 248, 0.02)",
      fill: true,
      tension: 0.3,
      borderWidth: 1.5,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointBackgroundColor: "#38bdf8",
      pointBorderColor: "#0a0e1a",
      pointBorderWidth: 2,
    });
  }

  if (visibleSeries.value.smartLoad) {
    datasets.push({
      label: "Smart Load (W)",
      data: [...history.value.smartLoad],
      borderColor: "#fb923c",
      backgroundColor: "rgba(251, 146, 60, 0.02)",
      fill: true,
      tension: 0.3,
      borderWidth: 1.5,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointBackgroundColor: "#fb923c",
      pointBorderColor: "#0a0e1a",
      pointBorderWidth: 2,
    });
  }

  return {
    labels: [...history.value.timestamps],
    datasets,
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: "index" as const,
      intersect: false,
      backgroundColor: "rgba(10, 14, 26, 0.95)",
      titleColor: "#94a3b8",
      bodyColor: "#f1f5f9",
      borderColor: "rgba(148, 163, 184, 0.12)",
      borderWidth: 1,
      padding: 10,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#64748b",
        font: {
          size: 10,
        },
        maxTicksLimit: 10,
      },
    },
    y: {
      grid: {
        color: "rgba(148, 163, 184, 0.05)",
      },
      ticks: {
        color: "#64748b",
        font: {
          size: 10,
        },
      },
    },
  },
};
</script>

<style scoped>
.chart-toggles {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  margin-left: auto;
  font-size: 0.75rem;
}

.toggle-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid var(--border);
  transition: background 0.2s;
  user-select: none;
}

.toggle-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.toggle-item input {
  cursor: pointer;
}

.solar {
  color: var(--solar);
}
.battery {
  color: var(--battery);
}
.grid {
  color: var(--grid);
}
.load {
  color: var(--load);
}
.light-load {
  color: var(--info);
}
.smart-load {
  color: var(--warning);
}

.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 260px;
  color: var(--text-muted);
  font-size: 0.85rem;
}
</style>
