var config      = require("../config/specs");
var helper      = require("./helper");
var driver      = require("./driver");
var extendWebdriverIO = require("./util/webdriverio-ext");


describe('maputnik', function() {

  before(async function(done) {
    await extendWebdriverIO();
    helper.startGeoserver(done);
  });

  after(function(done) {
    helper.stopGeoserver(done);
  });

  beforeEach(async function() {
    await driver.setStyle(["geojson:example","raster:raster"])
    await browser.execute(function() {
      localStorage.setItem("survey", true);
    });
  });

  // -------- setup --------
  require("./util/coverage");
  // -----------------------

  // ---- All the tests ----
  require("./history");
  require("./layers");
  require("./map");
  require("./modals");
  require("./screenshots");
  require("./accessibility");
  require("./keyboard");
  // ------------------------

});

