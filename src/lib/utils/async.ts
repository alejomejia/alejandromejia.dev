/** Resolves after `ms` milliseconds; rejects with `signal.reason` if aborted first. */
export function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason)

    function handleAbort() {
      clearTimeout(timer)
      reject(signal?.reason)
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', handleAbort)
      resolve()
    }, ms)
    signal?.addEventListener('abort', handleAbort, { once: true })
  })
}

/**
 * Resolves on the next animation frame; rejects with `signal.reason` if
 * aborted first. Client-only.
 */
export function waitForNextFrame(signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason)

    function handleAbort() {
      cancelAnimationFrame(frame)
      reject(signal?.reason)
    }

    const frame = requestAnimationFrame(() => {
      signal?.removeEventListener('abort', handleAbort)
      resolve()
    })
    signal?.addEventListener('abort', handleAbort, { once: true })
  })
}

/**
 * Resolves once the tab is visible (immediately if it is); rejects with
 * `signal.reason` if aborted first. Client-only. Timers keep running in a
 * background tab while animation frames don't, so gate time-based sequences
 * on this.
 */
export function waitForPageVisible(signal?: AbortSignal): Promise<void> {
  if (document.visibilityState === 'visible') return Promise.resolve()
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason)

    function cleanup() {
      document.removeEventListener('visibilitychange', handleChange)
      signal?.removeEventListener('abort', handleAbort)
    }
    function handleChange() {
      if (document.visibilityState !== 'visible') return
      cleanup()
      resolve()
    }
    function handleAbort() {
      cleanup()
      reject(signal?.reason)
    }

    document.addEventListener('visibilitychange', handleChange)
    signal?.addEventListener('abort', handleAbort, { once: true })
  })
}

/**
 * Resolves `true` once `condition()` holds, checked every `interval` ms, or
 * `false` when `timeout` ms pass first. Timer-based on purpose: animation
 * frames pause in background tabs and while a view transition captures the
 * page, so a frame loop could wait forever.
 */
export function waitUntil(condition: () => boolean, { timeout = 3000, interval = 16 } = {}): Promise<boolean> {
  const deadline = performance.now() + timeout
  return new Promise((resolve) => {
    function check() {
      if (condition()) return resolve(true)
      if (performance.now() >= deadline) return resolve(false)
      setTimeout(check, interval)
    }
    check()
  })
}

/**
 * Resolves once the window `load` event has fired (immediately if it already
 * has). Client-only: call it from effects or event handlers, never during render.
 */
export function waitForWindowLoad(): Promise<void> {
  if (document.readyState === 'complete') return Promise.resolve()
  return new Promise((resolve) => window.addEventListener('load', () => resolve(), { once: true }))
}

/**
 * Resolves once `image` has loaded or failed (immediately if it already has).
 * Never rejects: a broken image is still done loading. Client-only.
 */
export function waitForImage(image: HTMLImageElement): Promise<void> {
  if (image.complete) return Promise.resolve()
  return new Promise((resolve) => {
    image.addEventListener('load', () => resolve(), { once: true })
    image.addEventListener('error', () => resolve(), { once: true })
  })
}

/**
 * Resolves once `video` can play to the end without stalling, or has failed
 * (immediately if either already happened). Never rejects. Client-only.
 */
export function waitForVideo(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA || video.error) return Promise.resolve()
  return new Promise((resolve) => {
    video.addEventListener('canplaythrough', () => resolve(), { once: true })
    video.addEventListener('error', () => resolve(), { once: true })
  })
}

/**
 * Preloads an image so it is cached before it is rendered, preventing flicker.
 * @throws if the image fails to load.
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`))
    img.src = src
  })
}
