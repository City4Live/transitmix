// Lines Collection
import Backbone from 'backbone';
import { Line } from '../models/Line.js';
import * as utils from '../utils.js';

export const Lines = Backbone.Collection.extend({
  model: Line,
  url: '/api/lines',

  initialize: function() {
    this.on('change:name', this.sort, this);
  },

  comparator: function(a, b) {
    return utils.naturalSort(a.get('name'), b.get('name'));
  },
});

// Backward compatibility
if (typeof window !== 'undefined') {
  window.app = window.app || {};
  window.app.Lines = Lines;
}
