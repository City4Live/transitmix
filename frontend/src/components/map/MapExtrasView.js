// Map Extras View Component
// Additional buttons on the bottom of the UI for new map and nearby lines
import _ from 'underscore';
import { BaseView } from '../../framework/BaseView.js';
import { app } from '../../app.js';

export const MapExtrasView = BaseView.extend({
  template: _.template('<div class="showHome">New Map</div><div class="showNearby">Nearby Lines</div>'),

  initialize: function() {
    this.listenTo(app.events, 'map:toggleNearby', this.toggleText);
  },

  events: {
    'click .showHome': 'showHome',
    'click .showNearby': 'toggle'
  },

  showHome: function() {
    app.events.trigger('app:showHome');
  },

  toggle: function() {
    app.events.trigger('map:toggleNearby', this.model.get('center'));
  },

  toggleText: function() {
    if (this.toggled) {
      this.$('.showNearby').html('Show Nearby').removeClass('showing');
    } else {
      this.$('.showNearby').html('Hide Nearby').addClass('showing');
    }
    this.toggled = !this.toggled;
  },
});

// Backward compatibility
if (typeof window !== 'undefined') {
  window.app = window.app || {};
  window.app.MapExtrasView = MapExtrasView;
}
