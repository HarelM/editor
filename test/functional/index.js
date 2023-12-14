var driver      = require("./driver");
var extendWebdriverIO = require("./util/webdriverio-ext");

describe('maputnik', function() {

  before(async function(done) {
    await extendWebdriverIO();
    driver.geoserver.start(done);
  });

  after(function(done) {
    driver.geoserver.stop(done);
  });

  beforeEach(async function() {
    await driver.setStyle(["geojson:example","raster:raster"]);
    await driver.setSurvey();
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

