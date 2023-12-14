var config = require("../config/specs");
var helper = require("./helper");

const driver = {
    async setStyle(styleProperties) {
        await browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl(styleProperties));
        await browser.acceptAlert();
        const elem = await $(".maputnik-toolbar-link");
        await elem.waitForExist();
        await browser.flushReactUpdates();
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
    }
}
module.exports = driver;