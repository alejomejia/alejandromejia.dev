/** The skeleton's exit animation, so `LocalClock` knows when the wipe has ended. */
export const LOCAL_CLOCK_WIPE = 'local-clock-wipe'

/**
 * The skeleton's motion, shipped with the component (React hoists and
 * dedupes the `<style>`), so it runs before hydration and needs no global
 * CSS. The shimmer sweeps left to right, the way the wipe then goes. The
 * wipe moves only transforms: the mask slides right while its content
 * slides left by as much, so the bar stays put and only its left edge is
 * cut away. Reduced motion: a still bar, swapped for the time at once.
 */
export const LOCAL_CLOCK_CSS = `
@keyframes local-clock-shimmer {
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
}
@keyframes ${LOCAL_CLOCK_WIPE} {
  to { transform: translateX(100%); }
}
@keyframes local-clock-wipe-content {
  to { transform: translateX(-100%); }
}
.local-clock-shimmer {
  animation: local-clock-shimmer 1.2s ease-in-out infinite;
}
[data-local-clock-mask='out'] {
  animation: ${LOCAL_CLOCK_WIPE} 600ms var(--ease-out-quint, cubic-bezier(0.22, 1, 0.36, 1)) forwards;
}
[data-local-clock-mask='out'] > * {
  animation: local-clock-wipe-content 600ms var(--ease-out-quint, cubic-bezier(0.22, 1, 0.36, 1)) forwards;
}
@media (prefers-reduced-motion: reduce) {
  .local-clock-shimmer { animation: none; }
  [data-local-clock-mask='out'] { display: none; }
}
`
