// Controls top-level logic for which views to show at any given time. 
app.AppController = app.Controller.extend({
  initialize: function() {
    this.listenTo(app.events, 'app:showMap',           this.showMap);
    this.listenTo(app.events, 'app:showHome',          this.showHome);
    this.listenTo(app.events, 'app:showNotification',  this.showNotification);
    this.listenTo(app.events, 'app:createMap',         this.createMap);
    this.listenTo(app.events, 'app:remixMap',          this.remixMap);

    this.setupViews();
  },

  setupViews: function() {
    var options = {
      tileLayer: { detectRetina: true },
      infoControl: false,
      boxZoom: false,
    };

    // Initialize Leaflet map with MapTiler
    // Using proper bounds and zoom settings for MapLibre GL Leaflet compatibility
    app.leaflet = L.map('map', {
      maxBounds: [[180, -Infinity], [-180, Infinity]],
      maxBoundsViscosity: 1,
      minZoom: 1
    }).setView([40, -74.50], 9);

    // Add MapTiler layer using MapLibre GL
    var key = 'P284q8XPHrARfH62SV0k';
    const schemeLayer = L.maplibreGL({
      maxNativeZoom: 19,
      maxZoom: 21,
      attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
      style: `https://api.maptiler.com/maps/d35bccfc-5151-4344-9640-158d158f2e42/style.json?key=${key}`,
    }).addTo(app.leaflet);

    this.feedbackView = new app.FeedbackView();
    $('body').append(this.feedbackView.render().el);
  },

  showMap: function(mapId, lineId) {
    // If we're already viewing this map (i.e., back button), avoid loading it a second time
    var isLoaded = this.mapController && this.mapController.map.id === mapId;
    if (isLoaded) {
      this.mapController.selectLine(lineId);
      return;
    }

    this._closeControllers();
    this.mapController = new app.MapController({
      mapId: mapId,
      lineId: lineId,
      router: this.router
    });
    this.router.navigate('/map/' + mapId);
  },

  showHome: function() {
    this._closeControllers();
    this.homeController = new app.HomeController({ router: this });
    this.router.navigate('/');
  },

  remixMap: function(mapId) {
    var afterRemix = function(resp) {
      var message = 'Now editing a freshly-made duplicate of the original map.';
      app.events.trigger('app:showNotification', message);

      var map = new app.Map(resp, { parse: true });
      this._closeControllers();
      this.mapController = new app.MapController({ map: map, router: this.router });
    };

    var url = '/api/maps/' + mapId + '/remix';
    $.post(url, _.bind(afterRemix, this));
  },

  createMap: function(city) {
    var afterCreate = function(map) {
      this._closeControllers();
      this.mapController = new app.MapController({ map: map, router: this.router });
    };

    app.utils.geocode(city, function(latlng, name, preferMetricUnits) {
      var map = new app.Map({
        name: name,
        center: latlng,
        preferMetricUnits: preferMetricUnits
      });
      map.save({}, { success:  _.bind(afterCreate, this)});
    }, this);
  },

  // When switching between controllers, close the other ones
  _closeControllers: function() {
    if (this.mapController) {
      this.mapController.close();
      delete this.mapController;
    }
    if (this.homeController) {
      this.homeController.close();
      delete this.homeController;
    }
  },

  showNotification: function(message) {
    var notification = new app.NotificationView({ message: message });
    $('body').append(notification.render().el);
  },
});
