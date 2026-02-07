// App namespace and initialization
import _ from 'underscore';
import Backbone from 'backbone';

// Create the app namespace
export const app = {};

// Use mustache-style syntax for underscore templates
_.templateSettings = {
  evaluate: /\{#(.+?)#\}/g,
  interpolate: /\{\{(.+?)\}\}/g
};

// Initialize the application
export function initializeApp() {
  app.events = _.clone(Backbone.Events);
  new app.AppController({ router: new app.Router() });
  Backbone.history.start({ pushState: true, root: '/' });
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.app = app;
}
