export {
  formatDuration,
  formatLanguageName,
  formatList,
  formatRelativeTime,
} from './intl'
export { isInstanceofElement } from './isInstanceofElement'

export function safe<T, E>(
  fn: () => T,
): [error: null, result: T] | [error: E, result: null] {
  try {
    return [null, fn()]
  } catch (error) {
    return [error as E, null]
  }
}

/*#__NO_SIDE_EFFECTS__*/
export async function blobToBase64(blob: Blob): Promise<string> {
  const bytes = await blob.bytes()
  return bytes.toBase64()
}

/*#__NO_SIDE_EFFECTS__*/
export async function blobToDataURL(blob: Blob): Promise<string> {
  const base64 = await blobToBase64(blob)
  const mimeType = blob.type || 'application/octet-stream'
  return `data:${mimeType};base64,${base64}`
}

/*#__NO_SIDE_EFFECTS__*/
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  return Uint8Array.fromBase64(base64).buffer
}

/*#__NO_SIDE_EFFECTS__*/
export function formatBytes(bytes: number): string {
  const base = 1024
  let n = 0
  const labels = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB']

  while (bytes > base && n < labels.length - 1) {
    bytes /= base
    n++
  }

  return `${bytes.toFixed(2)}${labels[n]!}`
}
