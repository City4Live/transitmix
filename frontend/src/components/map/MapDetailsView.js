// Map Details View Component
// View that shows all the routes drawn, and lets you jump into any of them.
import _ from 'underscore';
import { BaseView } from '../../framework/BaseView.js';
import { CollectionView } from '../../framework/CollectionView.js';
import { mapDetailsViewTemplate, mapDetailsViewEmptyTemplate } from '../../templates/map-details-view.js';
import { app } from '../../app.js';
import * as utils from '../../utils.js';

export const MapDetailsView = BaseView.extend({
  className: 'mapDetailsView',

  normalTemplate: _.template(mapDetailsViewTemplate),
  emptyTemplate: _.template(mapDetailsViewEmptyTemplate),

  events: {
    'click .add': 'addLine',
    'click .remix': 'remix',
    'click .remixedFrom': 'remixedFrom',
    'click .share': 'showShare',
    'mouseleave': 'hideShare',
    'click .toggleSettings': 'toggleSettings',
    'click .toggleSettingsText': 'toggleSettings',
  },

  initialize: function() {
    this.listenTo(this.model.get('lines'), 'change', this.updateCalculations);
    this.listenTo(this.model, 'change', this.updateCalculations);
  },

  views: function() {
    var lineCollectionView = new CollectionView({
      collection: this.model.get('lines'),
      view: app.MapDetailsItemView,
    });

    return {
      '.lines': lineCollectionView,
    };
  },

  beforeRender: function() {
    var lines = this.model.get('lines');
    this.template = lines.length ? this.normalTemplate : this.emptyTemplate;
  },

  afterRender: function() {
    this.updateCalculations();
  },

  updateCalculations: function() {
    // TODO: Give the map model a function to compute it's summary statistics
    var lines = this.model.get('lines');

    var totalDistance = 0;
    var totalCost = 0;
    var totalBuses = 0;
    var totalHours = 0;

    lines.forEach(function(line) {
      var calcs = line.getCalculations();

      totalDistance += calcs.distance;
      totalCost += calcs.total.cost;
      totalBuses += calcs.total.buses;
      totalHours += calcs.total.revenueHours;
    });

    var distance;
    if (this.model.get('preferMetricUnits')) {
      distance = utils.milesToKilometers(totalDistance).toFixed(2) + ' km';
    } else {
      distance = totalDistance.toFixed(2) + ' miles';
    }

    this.$('.lineCount').html(lines.length);
    this.$('.distance').html(distance);
    this.$('.buses').html(totalBuses);
    this.$('.cost').html(utils.formatCost(totalCost));
    this.$('.hours').html(utils.addCommas(totalHours));

    this.$('.costWrapper').toggle(!this.model.get('preferServiceHours'));
    this.$('.hoursWrapper').toggle(this.model.get('preferServiceHours'));
  },

  addLine: function() {
    app.events.trigger('map:addLine');
  },

  showShare: function() {
    var url = utils.getBaseUrl() + '/map/' + this.model.id;
    var $inputField = this.$('.sharebox>input');

    $inputField.val(url);
    this.$('.sharebox').show();
    $inputField.select();
  },

  hideShare: function() {
    this.$('.sharebox').hide();
  },

  remix: function() {
    app.events.trigger('app:remixMap', this.model.id);
  },

  remixedFrom: function() {
    app.events.trigger('app:showMap', this.model.get('remixedFromId'));
  },

  toggleSettings: function() {
    app.events.trigger('map:toggleSettings');
  },
});

// Backward compatibility
if (typeof window !== 'undefined') {
  window.app = window.app || {};
  window.app.MapDetailsView = MapDetailsView;
}
