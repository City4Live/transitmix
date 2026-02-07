// Nearby View Components
import _ from 'underscore';
import { BaseView } from '../../framework/BaseView.js';
import { CollectionView } from '../../framework/CollectionView.js';
import { nearbyEmptyViewTemplate } from '../../templates/nearby-empty-view.js';
import { app } from '../../app.js';

export const NearbyView = BaseView.extend({
  className: 'nearbyView',
  template: _.template('<div class="nearbyMaps"></div>'),

  views: function() {
    if (this.collection.length === 0)  {
      return { '.nearbyMaps': new NearbyEmptyView() };
    }

    var nearbyMapViews = new CollectionView({
      collection: this.collection,
      view: NearbyMapView,
    });

    return {
      '.nearbyMaps': nearbyMapViews,
    };
  },
});

export const NearbyMapView = BaseView.extend({
  className: 'nearbyMap',
  template: _.template('<h2>{{ name }}</h2><div class="nearbyLines"></div>'),

  views: function() {
    var nearbyLineViews = new CollectionView({
      collection: this.model.get('lines'),
      view: NearbyLineView,
    });

    return {
      '.nearbyLines': nearbyLineViews,
    };
  },
});

export const NearbyLineView = BaseView.extend({
  className: 'nearbyLine',
  template: _.template('<span>{{ name }}</span>'),

  events: {
    'click': 'addLine',
  },

  addLine: function() {
    app.events.trigger('map:addNearbyLine', this.model);
  },
});

export const NearbyEmptyView = BaseView.extend({
  templateString: nearbyEmptyViewTemplate,
});

// Backward compatibility
if (typeof window !== 'undefined') {
  window.app = window.app || {};
  window.app.NearbyView = NearbyView;
  window.app.NearbyMapView = NearbyMapView;
  window.app.NearbyLineView = NearbyLineView;
  window.app.NearbyEmptyView = NearbyEmptyView;
}
