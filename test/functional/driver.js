var {v1: uuid} = require('uuid');
var fs = require("fs");
var config = require("../config/specs");
var wd = require("../wd-helper");
var geoServer = require("../geojson-server");

var testNetwork = process.env.TEST_NETWORK || "localhost";
var geoserver;


const driver = {
    geoserver: {
      start(done) {
        geoserver = geoServer.listen(9002, "0.0.0.0", done);
      },
      stop(done) {
        geoserver.close(done);
        geoserver = undefined;
      },
    },
    getStyleUrl(styles) {
      var port = geoserver.address().port;
      return "http://"+testNetwork+":"+port+"/styles/empty/"+styles.join(",");
    },
    getGeoServerUrl(urlPath) {
      var port = geoserver.address().port;
      return "http://"+testNetwork+":"+port+"/"+urlPath;
    },

    async setStyle(styleProperties, zoom) {
      let url = config.baseUrl + "?debug";
      if (styleProperties && Array.isArray(styleProperties)) {
        url += "&style=" + this.getStyleUrl(styleProperties);
      } else if (styleProperties && typeof styleProperties === "string") {
        url += "&style=" + this.getGeoServerUrl(styleProperties);
      }
      if (zoom) {
        url += "#" + zoom + "/41.3805/2.1635";
      }
      await browser.url(url);
      if (styleProperties) {
        await browser.acceptAlert();
      }
      await this.waitForExist(".maputnik-toolbar-link");
      await this.zeroTimeout();
    },
    async getStyleStore() {
      return await browser.executeAsync(function(done) {
        window.debug.get("maputnik", "styleStore").latestStyle(done);
      });
    },
    async setSurvey() {
      await browser.execute(function() {
        localStorage.setItem("survey", true);
      });
    },
    async isMac() {
      return await browser.execute(function() {
        return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      });
    },
    async typeKeys(keys) {
      await browser.keys(keys)
    },
    async click(selector) {
      const elem = await $(selector);
      await elem.click();
    },
    async selectFromDropdown(selector, value) {
      const selectBox = await $(selector);
      await selectBox.selectByAttribute('value', value);
      await this.zeroTimeout();
    },
    async isDisplayedInViewport(selector) {
      const elem = await $(selector);
      return elem.isDisplayedInViewport();
    },
    async isFocused(selector) {
      const elem = await $(selector);
      return elem.isFocused();
    },
    async setValue(selector, value) {
      await browser.setValueSafe(selector, value);
    },
    getExampleFilePath() {
      return __dirname + "/../example-style.json";
    },
    async getExampleFileData() {
      var styleFilePath = this.getExampleFilePath();
      return JSON.parse(fs.readFileSync(styleFilePath));
    },
    async chooseExampleFile() {
      const elem = await $("*[type='file']");
      await elem.waitForExist();
      await browser.chooseFile("*[type='file']", this.getExampleFilePath());
    },
    async zeroTimeout() {
      await browser.flushReactUpdates();
    },
    async sleep(milliseconds) {
      await browser.pause(milliseconds);
    },
    async isExisting(selector) {
      const elem = await $(selector);
      return elem.isExisting();
    },
    async waitForExist(selector) {
      const elem = await $(selector);
      await elem.waitForExist();
    },
    async setWindowSize(height, width) {
      await browser.setWindowSize(height, width);
    },
    async takeScreenShot(fileName) {
      await browser.takeScreenShot(fileName);
    },
    async openLayersModal() {
      const selector = await $(wd.$('layer-list:add-layer'));
      await selector.click();

      // Wait for events
      await browser.flushReactUpdates();

      const elem = await $(wd.$('modal:add-layer'));
      await elem.waitForExist();
      await elem.isDisplayed();
      await elem.isDisplayedInViewport();

      // Wait for events
      await browser.flushReactUpdates();
    },
    async fillLayersModal(opts) {
      var type = opts.type;
      var layer = opts.layer;
      var id;
      if(opts.id) {
        id = opts.id
      }
      else {
        id = type+":"+uuid();
      }

      const selectBox = await $(wd.$("add-layer.layer-type", "select"));
      await selectBox.selectByAttribute('value', type);
      await browser.flushReactUpdates();

      await browser.setValueSafe(wd.$("add-layer.layer-id", "input"), id);
      if(layer) {
        await browser.setValueSafe(wd.$("add-layer.layer-source-block", "input"), layer);
      }

      await browser.flushReactUpdates();
      const elem_addLayer = await $(wd.$("add-layer"));
      await elem_addLayer.click();

      return id;
    },

    async closeModal(wdKey) {
      const selector = wd.$(wdKey);
    
      await browser.waitUntil(async function() {
        const elem = await $(selector);
        return await elem.isDisplayedInViewport();
      });
    
      await this.click(wd.$(wdKey+".close-modal"));
    
      await browser.waitUntil(async function() {
        return await browser.execute((selector) => {
          return !document.querySelector(selector);
        }, selector);
      });
    }
}
module.exports = driver;