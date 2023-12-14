var config = require("./config/spec");
var helper = require("./util/helper");

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
    }
}
module.exports = driver;