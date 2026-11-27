/** Activa o desactiva las animaciones de toda la interfaz (ajuste "Animaciones"). */
export function applyMotionSetting(enabled: boolean): void {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.motion = enabled ? 'on' : 'off'
}
