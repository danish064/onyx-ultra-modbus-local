import { ref, readonly } from 'vue'

interface MetricEntry {
  name: string
  value: number
  unit: string
}

interface MetricsData {
  [key: string]: MetricEntry
}

interface ApiResponse {
  timestamp: string
  inverter_ip: string
  metrics: MetricsData
}

const metrics = ref<MetricsData>({})
const timestamp = ref<string>('')
const isLoading = ref(false)
const error = ref<string | null>(null)
const isConnected = ref(false)
const pollCount = ref(0)

// History for charts — keep last 60 data points
const history = ref<{
  timestamps: string[]
  solar: number[]
  battery: number[]
  grid: number[]
  load: number[]
  soc: number[]
  lightLoad: number[]
  smartLoad: number[]
}>({
  timestamps: [],
  solar: [],
  battery: [],
  grid: [],
  load: [],
  soc: [],
  lightLoad: [],
  smartLoad: [],
})

const MAX_HISTORY = 60

let intervalId: ReturnType<typeof setInterval> | null = null

export function useMetrics() {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  function getVal(key: string): number {
    return metrics.value[key]?.value ?? 0
  }

  function getUnit(key: string): string {
    return metrics.value[key]?.unit ?? ''
  }

  function getName(key: string): string {
    return metrics.value[key]?.name ?? key
  }

  async function fetchMetrics() {
    if (isLoading.value) return
    isLoading.value = true
    error.value = null

    try {
      const res = await $fetch<ApiResponse>(`${apiBase}/api/metrics`)
      metrics.value = res.metrics
      timestamp.value = res.timestamp
      isConnected.value = true
      pollCount.value++

      // Push to history
      const h = history.value
      const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
      h.timestamps.push(now)
      h.solar.push(getVal('live_pv_total_power'))
      h.battery.push(getVal('battery_power'))
      h.grid.push(getVal('grid_power'))
      h.load.push(getVal('load_power'))
      h.soc.push(getVal('battery_soc'))
      h.lightLoad.push(getVal('light_load_power'))
      h.smartLoad.push(getVal('smart_load_power'))

      if (h.timestamps.length > MAX_HISTORY) {
        h.timestamps.shift()
        h.solar.shift()
        h.battery.shift()
        h.grid.shift()
        h.load.shift()
        h.soc.shift()
        h.lightLoad.shift()
        h.smartLoad.shift()
      }
    } catch (e: any) {
      console.error('Dashboard failed to fetch live metrics:', e)
      error.value = e?.message || 'Failed to fetch metrics'
      isConnected.value = false
    } finally {
      isLoading.value = false
    }
  }

  function startPolling(intervalMs = 10000) {
    stopPolling()
    fetchMetrics()
    intervalId = setInterval(fetchMetrics, intervalMs)
  }

  function stopPolling() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  return {
    metrics: readonly(metrics),
    timestamp: readonly(timestamp),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isConnected: readonly(isConnected),
    pollCount: readonly(pollCount),
    history: readonly(history),
    getVal,
    getUnit,
    getName,
    fetchMetrics,
    startPolling,
    stopPolling,
  }
}
