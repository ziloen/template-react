import { describe, expect, it } from 'vitest'
import { formatDuration, formatList, formatRelativeTime } from './intl'

describe('formatList', () => {
  it('formats list with default conjunction style', () => {
    const result = formatList(['apple', 'banana', 'cherry'], {
      language: 'en-US',
    })

    expect(result).toBe('apple, banana, and cherry')
  })

  it('format list with zh-CN locale and conjunction style', () => {
    const result = formatList(['苹果', '香蕉', '樱桃'], {
      language: 'zh-CN',
    })

    expect(result).toBe('苹果、香蕉和樱桃')
  })

  it('falls back to comma join when Intl.ListFormat throws', () => {
    const result = formatList(['apple', 'banana'], {
      language: 'invalid_locale',
    })

    expect(result).toBe('apple, banana')
  })
})

describe('formatRelativeTime', () => {
  it('picks the first non-zero unit from duration', () => {
    const result = formatRelativeTime(
      '2026-03-10T00:00:00Z',
      'en-US',
      Temporal.Instant.from('2026-01-10T00:00:00Z').toZonedDateTimeISO('UTC'),
    )

    console.log(result)

    expect(result).toBe('in 2mo')
  })

  it('returns zero seconds when all duration units are zero', () => {
    const result = formatRelativeTime(
      '2026-03-10T00:00:00Z',
      'en-US',
      Temporal.Instant.from('2026-03-10T00:00:00Z').toZonedDateTimeISO('UTC'),
    )

    expect(result).toBe('now')
  })
})

describe('formatDuration', () => {
  it("formats duration with Intl.DurationFormat and doesn't pad minutes/seconds when padZero is false", () => {
    const result = formatDuration(
      { hours: 1, minutes: 5, seconds: 9 },
      { language: 'en-US', style: 'narrow' },
    )

    expect(result).toBe('1h 5m 9s')
  })

  it('formats with Intl.DurationFormat and pads minutes/seconds when padZero is true', () => {
    const result = formatDuration(
      { hours: 1, minutes: 5, seconds: 9 },
      { language: 'en-US', padZero: true, style: 'digital' },
    )

    expect(result).toBe('1:05:09')
  })
})
