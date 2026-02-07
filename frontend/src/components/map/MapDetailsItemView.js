// Map Details Item View Component
import _ from 'underscore';
import { BaseView } from '../../framework/BaseView.js';
import { mapDetailsItemViewTemplate } from '../../templates/map-details-item-view.js';
import { app } from '../../app.js';
import * as utils from '../../utils.js';

export const MapDetailsItemView = BaseView.extend({
  templateString: mapDetailsItemViewTemplate,

  events: {
    'click': 'selectLine',
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model.collection.map, 'change', this.render);
  },

  serialize: function() {
    var map = this.model.collection.map;
    var attrs = _.clone(this.model.attributes);
    var calcs = this.model.getCalculations();
    calcs.totalCost = utils.formatCost(calcs.total.cost);

    if (map.get('preferMetricUnits')) {
      calcs.distance = utils.milesToKilometers(calcs.distance).toFixed(2) + ' km';
    } else {
      calcs.distance = calcs.distance.toFixed(2) + ' miles';
    }

    if (map.get('preferServiceHours')) {
      calcs.totalCost = utils.addCommas(calcs.total.revenueHours + ' hrs');
    }

    return _.extend(attrs, calcs);
  },

  selectLine: function() {
    app.events.trigger('map:selectLine', this.model.id);
  }
});

// Backward compatibility
if (typeof window !== 'undefined') {
  window.app = window.app || {};
  window.app.MapDetailsItemView = MapDetailsItemView;
}
