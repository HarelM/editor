var assert = require("assert");
var wd     = require("../../wd-helper");
var driver = require("../driver");

describe("keyboard", function() {
  describe("shortcuts", function() {
    it("ESC should unfocus", async function() {
      const targetSelector = wd.$("nav:inspect") + " select";
      driver.click(targetSelector);
      assert(await driver.isFocused(targetSelector));

      await driver.typeKeys(["Escape"]);
      assert(await (await $("body")).isFocused());
    });

    it("'?' should show shortcuts modal", async function() {
      await driver.typeKeys(["?"]);
      assert(await driver.isDisplayedInViewport(wd.$("modal:shortcuts")));
    });

    it("'o' should show open modal", async function() {
      await driver.typeKeys(["o"]);
      assert(await driver.isDisplayedInViewport(wd.$("modal:open")));
    });

    it("'e' should show export modal", async function() {
      await driver.typeKeys(["e"]);
      assert(await driver.isDisplayedInViewport(wd.$("modal:export")));
    });

    it("'d' should show sources modal", async function() {
      await driver.typeKeys(["d"]);
      assert(await driver.isDisplayedInViewport(wd.$("modal:sources")));
    });

    it("'s' should show settings modal", async function() {
      await driver.typeKeys(["s"]);
      assert(await driver.isDisplayedInViewport(wd.$("modal:settings")));
    });

    it.skip("'i' should change map to inspect mode", async function() {
      // await driver.typeKeys(["i"]);
    });

    it("'m' should focus map", async function() {
      await driver.typeKeys(["m"]);
      assert(await driver.isFocused(".maplibregl-canvas"));
    });

    it("'!' should show debug modal", async function() {
      await driver.typeKeys(["!"]);
      assert(await driver.isDisplayedInViewport(wd.$("modal:debug")));
    });
  });

});
