// Home View Component
import { BaseView } from '../../framework/BaseView.js';
import { homeViewTemplate } from '../../templates/home-view.js';
import { app } from '../../app.js';

export const HomeView = BaseView.extend({
  className: 'homeView',

  templateString: homeViewTemplate,

  events: {
    'click .homeStartButton': 'createMap',
    'keydown': 'captureEnter',
  },

  createMap: function() {
    var city = this.$('.homeCity').html();
    if (!city) return;

    app.events.trigger('app:createMap', city);
  },

  captureEnter: function (event) {
    if (event.which === 13) {
      event.stopPropagation();
      event.preventDefault();
      this.createMap();
    }
  }
});

// Backward compatibility
if (typeof window !== 'undefined') {
  window.app = window.app || {};
  window.app.HomeView = HomeView;
}
