// ServiceWindow Model
import Backbone from 'backbone';
import * as utils from '../utils.js';

export const ServiceWindow = Backbone.Model.extend({
  // A simple model to store service windows for a line
  isValid: function() {
    var validTime = utils.diffTime(this.get('from'), this.get('to')) > 0;
    var validHeadway = this.get('headway') > 0;
    return validTime && validHeadway;
  },
});

// Backward compatibility
if (typeof window !== 'undefined') {
  window.app = window.app || {};
  window.app.ServiceWindow = ServiceWindow;
}
