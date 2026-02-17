// ✏️ Change this ONE value to re-theme the entire app
export const BASE_COLOR = '#3b6eb5'

// Auto-generates a full Tailwind-style shade palette from a single hex
function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)] as const
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(v => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('')
}

function mix(color: readonly [number, number, number], target: readonly [number, number, number], amount: number) {
  return color.map((c, i) => c + (target[i] - c) * amount) as unknown as [number, number, number]
}

export function generatePalette(hex: string) {
  const rgb = hexToRgb(hex)
  const white: [number, number, number] = [255, 255, 255]
  const black: [number, number, number] = [0, 0, 0]

  return {
    50:  rgbToHex(...mix(rgb, white, 0.93)),
    100: rgbToHex(...mix(rgb, white, 0.84)),
    200: rgbToHex(...mix(rgb, white, 0.72)),
    300: rgbToHex(...mix(rgb, white, 0.56)),
    400: rgbToHex(...mix(rgb, white, 0.32)),
    500: hex,
    600: rgbToHex(...mix(rgb, black, 0.12)),
    700: rgbToHex(...mix(rgb, black, 0.28)),
    800: rgbToHex(...mix(rgb, black, 0.44)),
    900: rgbToHex(...mix(rgb, black, 0.60)),
  }
}

export const cineva = generatePalette(BASE_COLOR)

export const coral = {
  400: '#f87171',
  500: '#e8587a',
  600: '#dc2666',
}
