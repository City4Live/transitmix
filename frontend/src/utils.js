// Utility functions
import $ from 'jquery';
import _ from 'underscore';

// Returns a set of coordinates that connect between 'from' and 'to' latlngs
// If an point.via is provided, the route will go through that point
// E.g. getRoute({from: [20, 30], to: [23, 40]}, callback)
// If options.ignoreRoads is true, returns a direct line between the two points.

export function getRoute(options, callback, context) {
  var waypoints = [options.from, options.to];
  if (options.via) waypoints.splice(1, 0, options.via);

  if (options.ignoreRoads) {
    callback.call(context || this, waypoints);
    return;
  }

  // Use OSRM as the primary routing service
  _osrmRouting(waypoints, callback, context);
}

export let _mapzenEndpointWorking = true;

export function _mapzenRouting(waypoints, callback, context) {
  var encodedPoints = waypoints.map(function(latlng) {
    return 'loc=' + latlng[0] + '%2C' + latlng[1];
  }).join('&');
  var url = 'http://osrm.mapzen.com/psv/viaroute?' + encodedPoints;

  $.ajax({
    url: url,
    dataType: 'json',
    success: function(response) {
      var geometry = response.route_geometry;
      var coordinates = decodeGeometry(geometry);
      callback.call(context || this, coordinates);
    },
    error: function() {
      console.log('Mapzen routing failed. Falling back to Mapbox.');
      _mapzenEndpointWorking = false;
    },
  });
}

export function _mapboxRouting(waypoints, callback, context) {
  // Flips from [lat, lng] to [lng, lat]
  var flip = function(latlng) {
    return [latlng[1], latlng[0]];
  };

  waypoints = waypoints.map(flip).join(';');
  var url = 'https://api.tiles.mapbox.com/v4/' +
  'directions/mapbox.driving/' + waypoints + '.json?geometry=polyline&access_token=pk.eyJ1IjoidGFubmVyaG9kZ2VzIiwiYSI6Ijk4NzA0Yjk3NDYwNWUwNWE2NGQzNjI1NjczZjQ3ZTEwIn0.xJPxZDCXsZAJ0Nlc8sxteA';

  $.getJSON(url, function(response) {
    if (response.error || response.routes.length === 0) {
      console.log('Unable to find route.', response.error);
    }

    var geometry = response.routes[0].geometry;
    var coordinates = decodeGeometry(geometry);
    callback.call(context || this, coordinates);
  });
}

// OSRM routing function
export function _osrmRouting(waypoints, callback, context) {
  // OSRM expects lon,lat format
  var coordinates = waypoints.map(function(wp) {
    return wp[1] + ',' + wp[0];
  }).join(';');

  var url = 'https://router.project-osrm.org/route/v1/driving/' + coordinates +
            '?overview=full&geometries=polyline';

  $.getJSON(url, function(response) {
    if (response.code === 'Ok' && response.routes && response.routes.length > 0) {
      var geometry = response.routes[0].geometry;
      var coordinates = decodeGeometry(geometry);
      callback.call(context || this, coordinates);
    } else {
      console.log('OSRM routing failed, using direct line');
      callback.call(context || this, waypoints);
    }
  }).fail(function() {
    console.log('OSRM request failed, using direct line');
    callback.call(context || this, waypoints);
  });
}

// Takes an encoded geometry and returns a set of latlngs
export function decodeGeometry(encoded, precision) {
  precision = precision || 6;
  precision = Math.pow(10, -precision);
  var len = encoded.length, index=0, lat=0, lng = 0, array = [];
  while (index < len) {
    var b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;
    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;
    array.push( [lat * precision, lng * precision] );
  }
  return array;
}

// Geocode a city into a latlng and a more formalized city name
// using the Google Maps geocoding API.
export function geocode(city, callback, context) {
  var key = 'P284q8XPHrARfH62SV0k';
  var url = 'https://api.maptiler.com/geocoding/' + encodeURIComponent(city) + '.json?key=' + key;

  $.getJSON(url, function(response) {
    if (response.error || response.features.length === 0) {
      console.log('Unable to geocode city. Womp Womp.', response.error);
    }

    // Get the coordinates for the center of the city
    var location = response.features[0].geometry.coordinates;
    var latlng = [location[1], location[0]];

    // Get the city's name
    var name = city;
    var preferMetric = true;

    callback.call(context || this, latlng, name, preferMetric);
  }).fail(function() {
    console.log('Geocoding failed, using default location');
    callback.call(context || this, [40, -74.50], city, true);
  });
}

export function getNearbyGTFS(latlng, callback, context) {
  var url = 'http://transitmix-gtfs.herokuapp.com/api/' +
    'agenciesNearbyWithRoutes/' + latlng[0] + '/' + latlng[1];

  $.getJSON(url, function(resp) {
    callback.call(context || this, resp);
  });
}

export function getNearbyCoordinates(agency, lineId, callback, context) {
  var url = 'http://transitmix-gtfs.herokuapp.com/api/coordinates/' +  agency + '/' + lineId;

  $.getJSON(url, function(resp) {
    callback.call(context || this, resp);
  });
}


// Calculate the distance between two latlngs.
// e.g. haversine([12.33, 78.99], [13.192, 79.11])
// https://github.com/niix/haversine/blob/master/haversine.js
export const haversine = (function() {
  var toRad = function(num) {
    return num * Math.PI / 180;
  };

  return function haversine(start, end, options) {
    var miles = 3960;
    var km    = 6371;
    options   = options || {};

    var R = options.unit === 'km' ? km : miles;

    var dLat = toRad(end[0] - start[0]);
    var dLon = toRad(end[1] - start[1]);
    var lat1 = toRad(start[0]);
    var lat2 = toRad(end[0]);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    if (options.threshold) {
      return options.threshold > (R * c);
    } else {
      return R * c;
    }
  };
})();

// Calculate the distance from an array of latlngs
export function calculateDistance(latlngs) {
  var sum = 0;

  for(var i = 0; i < latlngs.length - 1; i++) {
    sum += haversine(latlngs[i], latlngs[i + 1]);
  }

  return sum;
}

// Lightens or darkens a CSS hex color value
export function tweakColor(color, percent) {
  if (color[0] === '#') color = color.slice(1);
  var num = parseInt(color,16),
  amt = Math.round(2.55 * percent),
  R = (num >> 16) + amt,
  B = (num >> 8 & 0x00FF) + amt,
  G = (num & 0x0000FF) + amt;

  var value = (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
  return '#' + value;
}

// Given an array of latlngs, finds the index of
// the closest location to point
export function indexOfClosest(arr, point) {
  var closest = 0;
  var minDistance = haversine(arr[0], point);

  for (var i = 1; i < arr.length; i++) {
    var distance = haversine(arr[i], point);
    if (distance < minDistance) {
      minDistance = distance;
      closest = i;
    }
  }

  return closest;
}

// Given a line defined by two points, and a third point,
// find the distance between the point and the line
export function distanceToLine(latlng1, latlng2, point) {
    // source: http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
    var x0 = latlng1[1];
    var x1 = latlng2[1];
    var y0 = latlng1[0];
    var y1 = latlng2[0];

    // y = mx + b (slope of a line)
    var m = (y1-y0)/(x1-x0);
    var b = y0 - m * x0;

    // distance(mx - y + b = 0)
    var distance = Math.abs(m*point[1] - point[0] + b)/Math.sqrt(m*m + 1);
    return distance;
}

// Given an array of latlngs, finds the point within the line
// closest to the point given, and returns that point and the
// index it would belong in the line
export function closestPointInRoute(arr, point) {
    var closestDistance = Infinity;
    var closestIndex = -1;

    // for each point in arr, check distance from point to
    // the line from arr[i] -> arr[i+1]
    for (var i = 0; i < arr.length - 1; i++) {
        var newDistance = distanceToLine(arr[i], arr[i+1], point);
        if (newDistance < closestDistance) {
            closestDistance = newDistance;
            closestIndex = i + 1;
        }
    }

    var closestPointInLine = function(latlng1, latlng2, point) {
        // find the coordinates closest to point on the line defined by
        // points latlng1 and latlng2
        // source: http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
        var x0 = latlng1[1];
        var x1 = latlng2[1];
        var y0 = latlng1[0];
        var y1 = latlng2[0];

        // y = mx + b (slope of a line)
        var m = (y1-y0)/(x1-x0);
        var b = y0 - m * x0;

        var new_lat = (m*(point[1] + m*point[0]) + b) / (m*m+1);
        var new_lng = (-1*(-1*point[1] - m*point[0]) - m*b) / (m*m+1);

        return [new_lat, new_lng];
    };

    var closestPoint = closestPointInLine(arr[closestIndex-1], arr[closestIndex], point);
    return {
        point: closestPoint,
        index: closestIndex
    };
}

// Adds commas to a number
export function addCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Round cost to two significant figures and format it.
// Only works for thousands and millions.
export function formatCost(cost) {
  if (cost >= 10000000) {
    return '$' + (cost / 1000000).toFixed(0) + ' million';
  } else if (cost >= 1000000) {
    return '$' + (cost / 1000000).toFixed(1) + ' million';
  } else if (cost > 1000) {
    return '$' + (cost / 1000).toFixed(0) + 'k';
  } else {
    return '$' + cost;
  }
}

// Simple utility to calculate the difference, in minutes, between two hours
// formatted as either military time (23:00) or standard time (11pm). Does not
// work hours that cross day-boundries (e.g. 11pm to 1am).
export function diffTime(from, to) {
  var minutesIntoDay = function(time) {
    var hours = parseInt(time.split(':')[0], 10);

    var isAM = time.indexOf('a') > -1;
    var isPM = time.indexOf('p') > -1;
    var isNoon = isPM && hours === 12;
    var isMidnight = isAM && hours === 12;

    if (isPM && !isNoon) hours += 12;
    if (isMidnight) hours += 12;

    var hasMinutes = time.indexOf(':') > -1 ;
    var minutes = hasMinutes ? parseInt(time.split(':')[1], 10) : 0;

    return hours * 60 + minutes;
  };

  var diff = (minutesIntoDay(to) - minutesIntoDay(from));

  // Handle overnight times
  if (diff < 0) diff += 24 * 60;

  return diff;
}

// Removes undefined and null values from an object
export function removeUndefined(object) {
  return _.reduce(object, function(memo, val, key) {
    if(val !== undefined && val !== null) memo[key] = val;
    return memo;
  }, {});
}

// Cycles through available line colors, starting at a random point
export const getNextColor = (function() {
  var colors = ['#AD0101', '#0D7215', '#4E0963', '#0071CA',
                '#CE5504', '#B10086', '#049684', '#CC9B00',];
  var colorIndex = _.random(0, colors.length);

  return function() {
    colorIndex++;
    if (colorIndex >= colors.length) colorIndex = 0;
    return colors[colorIndex];
  };
})();

export const getRandomName = (function() {
  var names = ['Haberdasher', 'Puddle Jumper', 'Calypso', 'Inverter',
    'Heart of Gold', 'Yamato', 'Starfighter', 'Belafonte', 'Cousteau',
    'X Wing', 'Y Wing', 'TIE Fighter', 'Google Bus'];

  return function() {
    return _.sample(names);
  };
})();

export function getBaseUrl() {
  // Internet explorer doesn't have window.location.origin :(
  if (!window.location.origin) {
      var port = window.location.port ? ':' + window.location.port : '';
      return window.location.protocol + '//' + window.location.hostname + port;
  } else {
      return window.location.origin;
  }
}

// Natural string sorting
// http://www.overset.com/2008/09/01/javascript-natural-sort-algorithm/
export function naturalSort(a, b) {
    var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
        sre = /(^[ ]*|[ ]*$)/g,
        dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
        hre = /^0x[0-9a-f]+$/i,
        ore = /^0/,
        i = function(s) { return (''+s).toLowerCase(); },
        // convert all to strings strip whitespace
        x = i(a).replace(sre, '') || '',
        y = i(b).replace(sre, '') || '',
        // chunk/tokenize
        xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
        yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
        // numeric, hex or date detection
        xD = parseInt(x.match(hre)) || (xN.length !== 1 && x.match(dre) && Date.parse(x)),
        yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null,
        oFxNcL, oFyNcL;
    // first try and sort Hex codes or Dates
    if (yD)
        if ( xD < yD ) return -1;
        else if ( xD > yD ) return 1;
    // natural sorting through split numeric strings and default strings
    for(var cLoc=0, numS=Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
        // find floats not starting with '0', string or 0 if not defined (Clint Priest)
        oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
        oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
        // handle numeric vs string comparison - number < string - (Kyle Adams)
        if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL)) ? 1 : -1; }
        // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
        else if (typeof oFxNcL !== typeof oFyNcL) {
            oFxNcL += '';
            oFyNcL += '';
        }
        if (oFxNcL < oFyNcL) return -1;
        if (oFxNcL > oFyNcL) return 1;
    }
    return 0;
}

export function milesToKilometers(miles) {
  return miles * 1.60934;
}

export function kilometersToMiles(kilometers) {
  return kilometers * 0.621371;
}
