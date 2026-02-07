// Maps Collection
import Backbone from 'backbone';
import { Map } from '../models/Map.js';

export const Maps = Backbone.Collection.extend({
  model: Map,
  url: '/api/maps',
});

// Backward compatibility
if (typeof window !== 'undefined') {
  window.app = window.app || {};
  window.app.Maps = Maps;
}
