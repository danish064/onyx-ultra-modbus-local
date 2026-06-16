let isPolling = false;

export function acquireLock() {
  if (isPolling) return false;
  isPolling = true;
  return true;
}

export function releaseLock() {
  isPolling = false;
}
