let isPolling = false;
let lockTime = 0;

export function acquireLock() {
  const now = Date.now();
  // Expire lock if it has been held for more than 15 seconds (e.g. failed/hanging socket)
  if (isPolling && (now - lockTime < 15000)) {
    return false;
  }
  isPolling = true;
  lockTime = now;
  return true;
}

export function releaseLock() {
  isPolling = false;
  lockTime = 0;
}
