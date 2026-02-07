// Main entry point for Vite
import './styles/main.scss';

// Import libraries
import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import 'backbone.stickit';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@maplibre/maplibre-gl-leaflet';

// Make libraries available globally for backward compatibility
window.$ = window.jQuery = $;
window._ = _;
window.Backbone = Backbone;
window.L = L;
window.maplibregl = maplibregl;

// L.multiPolyline compatibility implementation
L.multiPolyline = function(latlngs, options) {
  // Handle empty object or falsy values - create empty feature group
  if (!latlngs || typeof latlngs !== 'object' || latlngs.length === 0) {
    var featureGroup = L.featureGroup();

    // Add setLatLngs method for later use
    featureGroup.setLatLngs = function(newLatLngs) {
      featureGroup.clearLayers();

      if (newLatLngs && newLatLngs.length > 0) {
        // Check if it's a multi-segment array (array of arrays)
        if (Array.isArray(newLatLngs[0]) && Array.isArray(newLatLngs[0][0])) {
          // Multi-segment case
          for (var i = 0; i < newLatLngs.length; i++) {
            if (newLatLngs[i] && newLatLngs[i].length > 0) {
              L.polyline(newLatLngs[i], options).addTo(featureGroup);
            }
          }
        } else {
          // Single segment case
          L.polyline(newLatLngs, options).addTo(featureGroup);
        }
      }

      return featureGroup;
    };

    return featureGroup;
  }

  // Check if it's a multi-segment array (array of coordinate arrays)
  if (Array.isArray(latlngs[0]) && Array.isArray(latlngs[0][0])) {
    // Multi-segment case: create feature group with multiple polylines
    var featureGroup = L.featureGroup();
    var polylines = [];

    for (var i = 0; i < latlngs.length; i++) {
      var segment = latlngs[i];
      if (segment && segment.length > 0) {
        var polyline = L.polyline(segment, options);
        polylines.push(polyline);
        featureGroup.addLayer(polyline);
      }
    }

    featureGroup.getLayers = function() {
      return polylines;
    };

    featureGroup.setLatLngs = function(newLatLngs) {
      featureGroup.clearLayers();
      polylines = [];

      if (newLatLngs && newLatLngs.length > 0) {
        for (var i = 0; i < newLatLngs.length; i++) {
          var segment = newLatLngs[i];
          if (segment && segment.length > 0) {
            var polyline = L.polyline(segment, options);
            polylines.push(polyline);
            featureGroup.addLayer(polyline);
          }
        }
      }

      return featureGroup;
    };

    return featureGroup;
  } else {
    // Single segment case: use regular polyline
    return L.polyline(latlngs, options);
  }
};

// Mapbox compatibility shim for existing code
window.L.mapbox = {
  accessToken: null,
  map: function(id) { return L.map(id); },
  styleLayer: function(styleUrl) { return {}; }
};

// Import app modules
import { app, initializeApp } from './app.js';
import * as utils from './utils.js';
import { Router } from './router.js';

// Framework
import { BaseView } from './framework/BaseView.js';
import { CollectionView } from './framework/CollectionView.js';
import { Controller } from './framework/Controller.js';

// Models
import { ServiceWindow } from './models/ServiceWindow.js';
import { Line } from './models/Line.js';
import { Map } from './models/Map.js';

// Collections
import { ServiceWindows } from './collections/ServiceWindows.js';
import { Lines } from './collections/Lines.js';
import { Maps } from './collections/Maps.js';

// Components - App
import { AppController } from './components/app/AppController.js';
import { FeedbackView } from './components/app/FeedbackView.js';
import { NotificationView } from './components/app/NotificationView.js';

// Components - Home
import { HomeController } from './components/home/HomeController.js';
import { HomeView } from './components/home/HomeView.js';

// Components - Map
import { MapController } from './components/map/MapController.js';
import { MapDetailsView } from './components/map/MapDetailsView.js';
import { MapDetailsItemView } from './components/map/MapDetailsItemView.js';
import { MapExtrasView } from './components/map/MapExtrasView.js';
import { MapSettingsView } from './components/map/MapSettingsView.js';
import { LineDetailsView } from './components/map/LineDetailsView.js';
import { LeafletLineView } from './components/map/LeafletLineView.js';
import { LeafletEditableLineView } from './components/map/LeafletEditableLineView.js';
import { ServiceWindowView } from './components/map/ServiceWindowView.js';
import { NearbyView, NearbyMapView, NearbyLineView, NearbyEmptyView } from './components/map/NearbyView.js';

// Assign to app namespace for backward compatibility
app.utils = utils;
app.Router = Router;
app.BaseView = BaseView;
app.CollectionView = CollectionView;
app.Controller = Controller;
app.ServiceWindow = ServiceWindow;
app.Line = Line;
app.Map = Map;
app.ServiceWindows = ServiceWindows;
app.Lines = Lines;
app.Maps = Maps;
app.AppController = AppController;
app.FeedbackView = FeedbackView;
app.NotificationView = NotificationView;
app.HomeController = HomeController;
app.HomeView = HomeView;
app.MapController = MapController;
app.MapDetailsView = MapDetailsView;
app.MapDetailsItemView = MapDetailsItemView;
app.MapExtrasView = MapExtrasView;
app.MapSettingsView = MapSettingsView;
app.LineDetailsView = LineDetailsView;
app.LeafletLineView = LeafletLineView;
app.LeafletEditableLineView = LeafletEditableLineView;
app.ServiceWindowView = ServiceWindowView;
app.NearbyView = NearbyView;
app.NearbyMapView = NearbyMapView;
app.NearbyLineView = NearbyLineView;
app.NearbyEmptyView = NearbyEmptyView;

// Make app globally available
window.app = app;

// Initialize on DOM ready
$(document).ready(function() {
  initializeApp();
});
