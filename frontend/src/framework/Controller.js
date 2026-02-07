// Controller base class
import Backbone from 'backbone';
import _ from 'underscore';

export const Controller = function(options) {
  options = options || {};
  if (options.router) this.router = options.router;
  this.initialize.apply(this, arguments);
};

_.extend(Controller.prototype, Backbone.Events, {
  initialize: function() {
    this.setupViews();
  },

  setupViews: function(){},

  teardownViews: function(){},

  close: function() {
    this.teardownViews();
    this.stopListening();
  },
});

Controller.extend = Backbone.View.extend;

// Backward compatibility
if (typeof window !== 'undefined') {
  window.app = window.app || {};
  window.app.Controller = Controller;
}
