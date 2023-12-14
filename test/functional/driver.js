var config = require("../config/specs");
var helper = require("./helper");

const driver = {
    async setStyle(styleProperties) {
      let url = config.baseUrl+"?debug";
      if (styleProperties) {
        url += "&style=" + helper.getStyleUrl(styleProperties);
      }
      await browser.url();
      await browser.acceptAlert();
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
    async setValue(selector, value) {
      await browser.setValueSafe(selector, value);
    },
    async zeroTimeout() {
      await browser.flushReactUpdates();
    },
    async isExisting(selector) {
      return browser.isExisting(selector);
    },
    async waitForExist(selector) {
      const elem = await $(selector);
      await elem.waitForExist();
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