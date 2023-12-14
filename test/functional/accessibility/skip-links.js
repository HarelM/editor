var assert = require("assert");
var wd     = require("../../wd-helper");
var driver = require("../driver");


describe("skip links", function() {
  beforeEach(async function () {
    await browser.url(config.baseUrl+"?debug&style="+helper.getGeoServerUrl("example-layer-style.json"));
    await browser.acceptAlert();
    //await driver.setStyle("example-layer-style.json");
  });

  it("skip link to layer list", async function() {
    const selector = wd.$("root:skip:layer-list")
    assert(await driver.isExisting(selector));
    await driver.typeKeys(['Tab']);
    assert(await driver.isFocused(selector));
    await driver.click(selector);

    assert(await driver.isFocused("#skip-target-layer-list"));
  });

  it("skip link to layer editor", async function() {
    const selector = wd.$("root:skip:layer-editor")
    assert(await driver.isExisting(selector));
    await driver.typeKeys(['Tab']);
    await driver.typeKeys(['Tab']);
    assert(await driver.isFocused(selector));
    await driver.click(selector);

    assert(await driver.isFocused("#skip-target-layer-editor"));
  });

  it("skip link to map view", async function() {
    const selector = wd.$("root:skip:map-view")
    assert(await driver.isExisting(selector));
    await driver.typeKeys(['Tab']);
    await driver.typeKeys(['Tab']);
    await driver.typeKeys(['Tab']);
    assert(await driver.isFocused(selector));
    await driver.click(selector);

    assert(await driver.isFocused(".maplibregl-canvas"));
  });
});
