import { describe, it, expect } from 'vitest'
import {
  haversine,
  calculateDistance,
  decodeGeometry,
  diffTime,
  formatCost,
  addCommas,
  tweakColor,
  milesToKilometers,
  kilometersToMiles,
  removeUndefined,
  naturalSort,
  indexOfClosest,
  distanceToLine,
  closestPointInRoute,
} from '../src/utils.js'

describe('haversine', () => {
  it('calculates known distance between NYC and LA', () => {
    const nyc = [40.7128, -74.0060]
    const la = [34.0522, -118.2437]
    const distance = haversine(nyc, la)
    // ~2451 miles
    expect(distance).toBeGreaterThan(2400)
    expect(distance).toBeLessThan(2500)
  })

  it('returns 0 for same point', () => {
    const point = [37.7749, -122.4194]
    expect(haversine(point, point)).toBe(0)
  })

  it('returns distance in km when unit is km', () => {
    const nyc = [40.7128, -74.0060]
    const la = [34.0522, -118.2437]
    const miles = haversine(nyc, la)
    const km = haversine(nyc, la, { unit: 'km' })
    expect(km).toBeGreaterThan(miles)
    expect(km / miles).toBeCloseTo(1.60934, 1)
  })

  it('supports threshold option', () => {
    const a = [37.7749, -122.4194]
    const b = [37.7750, -122.4195]
    expect(haversine(a, b, { threshold: 1 })).toBe(true)
    expect(haversine(a, b, { threshold: 0.00001 })).toBe(false)
  })
})

describe('calculateDistance', () => {
  it('calculates distance for a multi-point route', () => {
    const points = [
      [37.7749, -122.4194],
      [37.7849, -122.4094],
      [37.7949, -122.3994],
    ]
    const distance = calculateDistance(points)
    expect(distance).toBeGreaterThan(0)
  })

  it('returns 0 for a single point', () => {
    expect(calculateDistance([[37.7749, -122.4194]])).toBe(0)
  })

  it('returns 0 for an empty array', () => {
    expect(calculateDistance([])).toBe(0)
  })
})

describe('decodeGeometry', () => {
  it('decodes a known encoded polyline', () => {
    // Encoded polyline for a simple path
    const encoded = '_p~iF~ps|U_ulLnnqC_mqNvxq`@'
    const decoded = decodeGeometry(encoded, 5)
    expect(decoded.length).toBeGreaterThan(0)
    expect(decoded[0]).toHaveLength(2)
    // First point should be approximately [38.5, -120.2]
    expect(decoded[0][0]).toBeCloseTo(38.5, 0)
    expect(decoded[0][1]).toBeCloseTo(-120.2, 0)
  })

  it('returns empty array for empty string', () => {
    expect(decodeGeometry('')).toEqual([])
  })
})

describe('diffTime', () => {
  it('calculates difference in military time', () => {
    expect(diffTime('6:00', '9:00')).toBe(180)
  })

  it('calculates difference in AM/PM time', () => {
    expect(diffTime('7am', '5pm')).toBe(600)
  })

  it('handles overnight times (11pm to 3am)', () => {
    expect(diffTime('11pm', '3am')).toBe(240)
  })

  it('returns 0 for same time', () => {
    expect(diffTime('12:00', '12:00')).toBe(0)
  })

  it('handles noon correctly', () => {
    expect(diffTime('12pm', '1pm')).toBe(60)
  })

  it('handles midnight correctly', () => {
    expect(diffTime('12am', '1am')).toBe(60)
  })
})

describe('formatCost', () => {
  it('formats millions (>= 10M)', () => {
    expect(formatCost(15000000)).toBe('$15 million')
  })

  it('formats millions with decimal (1M - 10M)', () => {
    expect(formatCost(1500000)).toBe('$1.5 million')
  })

  it('formats thousands', () => {
    expect(formatCost(45000)).toBe('$45k')
  })

  it('formats small amounts', () => {
    expect(formatCost(500)).toBe('$500')
  })
})

describe('addCommas', () => {
  it('adds commas to large numbers', () => {
    expect(addCommas(1234567)).toBe('1,234,567')
  })

  it('leaves small numbers unchanged', () => {
    expect(addCommas(999)).toBe('999')
  })

  it('handles zero', () => {
    expect(addCommas(0)).toBe('0')
  })
})

describe('tweakColor', () => {
  it('lightens a color with positive percent', () => {
    const result = tweakColor('#000000', 20)
    expect(result).not.toBe('#000000')
    expect(result[0]).toBe('#')
    expect(result.length).toBe(7)
  })

  it('darkens a color with negative percent', () => {
    const result = tweakColor('#ffffff', -20)
    expect(result).not.toBe('#ffffff')
    expect(result[0]).toBe('#')
  })

  it('works without # prefix', () => {
    const withHash = tweakColor('#ff0000', 10)
    const withoutHash = tweakColor('ff0000', 10)
    expect(withHash).toBe(withoutHash)
  })
})

describe('milesToKilometers', () => {
  it('converts 1 mile to approximately 1.609 km', () => {
    expect(milesToKilometers(1)).toBeCloseTo(1.60934, 4)
  })

  it('converts 0 miles to 0 km', () => {
    expect(milesToKilometers(0)).toBe(0)
  })
})

describe('kilometersToMiles', () => {
  it('converts 1 km to approximately 0.621 miles', () => {
    expect(kilometersToMiles(1)).toBeCloseTo(0.621371, 4)
  })

  it('converts 0 km to 0 miles', () => {
    expect(kilometersToMiles(0)).toBe(0)
  })

  it('roundtrips with milesToKilometers', () => {
    const original = 5
    expect(kilometersToMiles(milesToKilometers(original))).toBeCloseTo(original, 4)
  })
})

describe('removeUndefined', () => {
  it('removes undefined values', () => {
    expect(removeUndefined({ a: 1, b: undefined, c: 3 })).toEqual({ a: 1, c: 3 })
  })

  it('removes null values', () => {
    expect(removeUndefined({ a: 1, b: null, c: 3 })).toEqual({ a: 1, c: 3 })
  })

  it('keeps valid falsy values like 0 and empty string', () => {
    expect(removeUndefined({ a: 0, b: '', c: false })).toEqual({ a: 0, b: '', c: false })
  })
})

describe('naturalSort', () => {
  it('sorts "Route 2" before "Route 10"', () => {
    const arr = ['Route 10', 'Route 2', 'Route 1']
    const sorted = arr.sort(naturalSort)
    expect(sorted).toEqual(['Route 1', 'Route 2', 'Route 10'])
  })

  it('sorts numbers before strings', () => {
    const arr = ['banana', '1', 'apple', '2']
    const sorted = arr.sort(naturalSort)
    expect(sorted[0]).toBe('1')
    expect(sorted[1]).toBe('2')
  })

  it('is case-insensitive', () => {
    const arr = ['Banana', 'apple']
    const sorted = arr.sort(naturalSort)
    expect(sorted).toEqual(['apple', 'Banana'])
  })
})

describe('indexOfClosest', () => {
  it('finds the closest point in an array', () => {
    const arr = [
      [37.0, -122.0],
      [38.0, -122.0],
      [39.0, -122.0],
    ]
    const point = [37.9, -122.0]
    expect(indexOfClosest(arr, point)).toBe(1)
  })

  it('returns 0 for exact match on first element', () => {
    const arr = [
      [37.0, -122.0],
      [38.0, -122.0],
    ]
    expect(indexOfClosest(arr, [37.0, -122.0])).toBe(0)
  })
})

describe('distanceToLine', () => {
  it('returns 0 for a point on the line', () => {
    const a = [0, 0]
    const b = [0, 10]
    const point = [0, 5]
    expect(distanceToLine(a, b, point)).toBeCloseTo(0, 10)
  })

  it('returns positive distance for a point off the line', () => {
    const a = [0, 0]
    const b = [0, 10]
    const point = [5, 5]
    expect(distanceToLine(a, b, point)).toBeGreaterThan(0)
  })
})

describe('closestPointInRoute', () => {
  it('returns the correct index and projected point', () => {
    const route = [
      [0, 0],
      [0, 10],
      [0, 20],
    ]
    const point = [1, 5]
    const result = closestPointInRoute(route, point)
    expect(result.index).toBe(1)
    expect(result.point).toBeDefined()
    expect(result.point).toHaveLength(2)
  })

  it('projected point is closer to the line than the original point', () => {
    const route = [
      [0, 0],
      [0, 10],
      [10, 10],
    ]
    const point = [2, 5]
    const result = closestPointInRoute(route, point)
    // The projected point should be on or very near the line
    expect(result.point[0]).toBeCloseTo(0, 0)
  })
})
