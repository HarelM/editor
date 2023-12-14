var assert = require('assert');
var wd     = require("../../wd-helper");
var driver = require("../driver");

describe("modals", function() {
  describe("open", function() {
    beforeEach(async function() {

      await driver.setStyle();
      await driver.click(wd.$("nav:open"));
      await driver.zeroTimeout();
    });

    it("close", async function() {
      await driver.closeModal("modal:open");
    });

    // "chooseFile" command currently not available for wdio v5 https://github.com/webdriverio/webdriverio/pull/3632
    it.skip("upload", async function() {
      await driver.chooseExampleFile();

      var styleObj = await driver.getStyleStore();
      assert.deepEqual(await driver.getExampleFileData(), styleObj);
    });

    it("load from url", async function() {
      var styleFileUrl = driver.getGeoServerUrl("example-style.json");

      await driver.setValue(wd.$("modal:open.url.input"), styleFileUrl);

      await driver.click(wd.$("modal:open.url.button"))

      // Allow the network request to happen
      // NOTE: Its localhost so this should be fast.
      await driver.sleep(300);

      var styleObj = await driver.getStyleStore();
      assert.deepEqual(await driver.getExampleFileData(), styleObj);
    });
  })

  describe("shortcuts", function() {
    it("open/close", async function() {
      await driver.setStyle();

      await driver.typeKeys(["?"]);

      const modalEl = await $(wd.$("modal:shortcuts"))
      assert(await modalEl.isDisplayed());

      await driver.closeModal("modal:shortcuts");
    });

  });

  describe("export", function() {

    beforeEach(async function() {
      await driver.setStyle();
      await driver.click(wd.$("nav:export"));
      await driver.zeroTimeout();
    });

    it("close", async function() {
      await driver.closeModal("modal:export");
    });

    // TODO: Work out how to download a file and check the contents
    it("download")

  })

  describe("sources", function() {
    it("active sources")
    it("public source")
    it("add new source")
  })

  describe("inspect", function() {
    it("toggle", async function() {
      await driver.setStyle(["geojson:example"]);

      await driver.selectFromDropdown(wd.$("nav:inspect", "select"), "inspect");
    })
  })

  describe("style settings", function() {
    beforeEach(async function() {
      await driver.setStyle();
      await driver.click(wd.$("nav:settings"));
      await driver.zeroTimeout();
    });

    it("name", async function() {
      await driver.setValue(wd.$("modal:settings.name"), "foobar");
      await driver.click(wd.$("modal:settings.owner"));
      await driver.zeroTimeout();

      var styleObj = await driver.getStyleStore();
      assert.equal(styleObj.name, "foobar");
    })
    it("owner", async function() {
      await driver.setValue(wd.$("modal:settings.owner"), "foobar")
      await driver.click(wd.$("modal:settings.name"));
      await driver.zeroTimeout();

      var styleObj = await driver.getStyleStore();
      assert.equal(styleObj.owner, "foobar");
    })
    it("sprite url", async function() {
      await driver.setValue(wd.$("modal:settings.sprite"), "http://example.com")
      await driver.click(wd.$("modal:settings.name"));
      await driver.zeroTimeout();

      var styleObj = await driver.getStyleStore();
      assert.equal(styleObj.sprite, "http://example.com");
    })
    it("glyphs url", async function() {
      var glyphsUrl = "http://example.com/{fontstack}/{range}.pbf"
      await driver.setValue(wd.$("modal:settings.glyphs"), glyphsUrl);
      await driver.click(wd.$("modal:settings.name"));
      await driver.zeroTimeout();

      var styleObj = await driver.getStyleStore();
      assert.equal(styleObj.glyphs, glyphsUrl);
    })

    it("maptiler access token", async function() {
      var apiKey = "testing123";
      await driver.setValue(wd.$("modal:settings.maputnik:openmaptiles_access_token"), apiKey);
      await driver.click(wd.$("modal:settings.name"));
      await driver.zeroTimeout();

      var styleObj = await driver.getStyleStore();
      assert.equal(styleObj.metadata["maputnik:openmaptiles_access_token"], apiKey);
    })

    it("thunderforest access token", async function() {
      var apiKey = "testing123";
      await driver.setValue(wd.$("modal:settings.maputnik:thunderforest_access_token"), apiKey);
      await driver.click(wd.$("modal:settings.name"));
      await driver.zeroTimeout();

      var styleObj = await driver.getStyleStore();
      assert.equal(styleObj.metadata["maputnik:thunderforest_access_token"], apiKey);
    })

    it("style renderer", async function() {
      await driver.selectFromDropdown(wd.$("modal:settings.maputnik:renderer"), "ol");
      await driver.click(wd.$("modal:settings.name"));
      await driver.zeroTimeout();

      var styleObj = await driver.getStyleStore();
      assert.equal(styleObj.metadata["maputnik:renderer"], "ol");
    })
  })

  describe("sources", function() {
    it("toggle")
  })
})
