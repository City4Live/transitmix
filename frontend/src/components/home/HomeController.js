// Home Controller Component
import $ from 'jquery';
import { Controller } from '../../framework/Controller.js';
import { app } from '../../app.js';

export const HomeController = Controller.extend({
  setupViews: function() {
    this.homeView = new app.HomeView();
    $('body').append(this.homeView.render().el);
  },

  teardownViews: function() {
    this.homeView.remove();
  },
});

// Backward compatibility
if (typeof window !== 'undefined') {
  window.app = window.app || {};
  window.app.HomeController = HomeController;
}
