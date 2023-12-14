var config = require("../config/specs");
var helper = require("./helper");
var wd = require("../wd-helper");
var fs = require("fs");

const driver = {
    async setStyle(styleProperties) {
      let url = config.baseUrl+"?debug";
      if (styleProperties && Array.isArray(styleProperties)) {
        url += "&style=" + helper.getStyleUrl(styleProperties);
      } else if (styleProperties && typeof styleProperties === "string") {
        url += "&style=" + helper.getGeoServerUrl(styleProperties);
      }
      await browser.url(url);
      if (styleProperties) {
        await browser.acceptAlert();
      }
      await this.waitForExist(".maputnik-toolbar-link");
      await this.zeroTimeout();
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
      return browser.isExisting(selector);
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