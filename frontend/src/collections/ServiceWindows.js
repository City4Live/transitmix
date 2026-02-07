// ServiceWindows Collection
import Backbone from 'backbone';
import { ServiceWindow } from '../models/ServiceWindow.js';

export const ServiceWindows = Backbone.Collection.extend({
  model: ServiceWindow,
});

// Backward compatibility
if (typeof window !== 'undefined') {
  window.app = window.app || {};
  window.app.ServiceWindows = ServiceWindows;
}
