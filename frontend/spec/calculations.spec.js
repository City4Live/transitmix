import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import Backbone from 'backbone'
import { app } from '../src/app.js'
import { ServiceWindow } from '../src/models/ServiceWindow.js'
import { ServiceWindows } from '../src/collections/ServiceWindows.js'
import { Lines } from '../src/collections/Lines.js'

// Wire up app namespace before model instantiation
app.ServiceWindow = ServiceWindow
app.ServiceWindows = ServiceWindows
app.Lines = Lines

import { Line } from '../src/models/Line.js'
import { Map } from '../src/models/Map.js'

// Prevent actual network calls from Backbone.sync
Backbone.sync = function () {}

describe('Line Calculations', () => {
  let simpleServiceWindows
  let simpleServiceWindowsWithWeekend
  let simpleOvernightServiceWindows
  let simpleCoordinates

  beforeEach(() => {
    simpleServiceWindows = new ServiceWindows([
      { name: 'All Day', from: '7am', to: '5pm', headway: 60 },
    ])

    simpleServiceWindowsWithWeekend = new ServiceWindows([
      { name: 'All Day', from: '7am', to: '5pm', headway: 60 },
      { name: 'All Saturday', from: '7am', to: '5pm', headway: 60, isSaturday: true },
      { name: 'All Sunday', from: '7am', to: '5pm', headway: 60, isSunday: true },
    ])

    simpleOvernightServiceWindows = new ServiceWindows([
      { name: 'All Day', from: '11pm', to: '3am', headway: 60 },
    ])

    // A line that's .5 miles one way, 1 mile two ways
    simpleCoordinates = [
      [[37.774853254793086, -122.45455741882324]],
      [
        [37.774847, -122.454656],
        [37.774756, -122.45464799999999],
        [37.775189, -122.45134999999999],
        [37.775881999999996, -122.44582399999999],
      ],
    ]
  })

  it('calculates 2550 service hours with one bus on weekdays only', () => {
    const map = new Map()
    const line = new Line(map.getLineDefaults())
    const lines = new Lines([line])

    map.lines = lines
    lines.map = map

    line.set(
      { speed: 10, serviceWindows: simpleServiceWindows, coordinates: simpleCoordinates },
      { silent: true }
    )
    const calculations = line.getCalculations()
    expect(calculations.total.revenueHours).toBe(2550)
  })

  it('calculates 3650 service hours with one bus every day', () => {
    const map = new Map()
    const line = new Line(map.getLineDefaults())
    const lines = new Lines([line])

    map.lines = lines
    lines.map = map

    line.set(
      {
        speed: 10,
        serviceWindows: simpleServiceWindowsWithWeekend,
        coordinates: simpleCoordinates,
      },
      { silent: true }
    )
    const calculations = line.getCalculations()
    expect(calculations.total.revenueHours).toBe(3650)
  })

  it('calculates 5220 service hours with default service windows', () => {
    const map = new Map()
    const line = new Line(map.getLineDefaults())
    line.set({ coordinates: simpleCoordinates }, { silent: true })

    const lines = new Lines([line])

    map.lines = lines
    lines.map = map

    const calculations = line.getCalculations()
    expect(calculations.total.revenueHours).toBe(5220)
  })

  it('correctly calculates overnight service windows', () => {
    const map = new Map()
    const line = new Line(map.getLineDefaults())
    line.set(
      { coordinates: simpleCoordinates, serviceWindows: simpleOvernightServiceWindows },
      { silent: true }
    )

    const lines = new Lines([line])

    map.lines = lines
    lines.map = map

    const calculations = line.getCalculations()

    const expectedHoursPerDay = 4
    const expectedWeekdays = line.get('weekdaysPerYear')
    const expectedServiceHours = expectedHoursPerDay * expectedWeekdays
    expect(calculations.total.revenueHours).toBe(expectedServiceHours)
  })

  it('calculates 5730 service hours when morning is enabled', () => {
    const map = new Map()
    const serviceWindows = map.get('serviceWindows')

    const morningWindow = serviceWindows.findWhere({ name: 'Morning' })
    morningWindow.set('enabled', true, { silent: true })

    const line = new Line(map.getLineDefaults())
    line.set({ coordinates: simpleCoordinates }, { silent: true })

    const lines = new Lines([line])

    map.lines = lines
    lines.map = map

    const calculations = line.getCalculations()
    expect(calculations.total.revenueHours).toBe(5730)
  })
})
