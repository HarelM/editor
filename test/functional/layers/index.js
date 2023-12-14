var assert = require("assert");
var config = require("../../config/specs");
var helper = require("../helper");
var driver = require("../driver");
var {v1: uuid} = require('uuid');
var wd     = require("../../wd-helper");


describe("layers", function() {
  beforeEach(async function() {
    driver.setStyle([
      "geojson:example",
      "raster:raster"
    ]);
    await helper.modal.addLayer.open();
  });

  describe("ops", function() {
    it("delete", async function() {
      var styleObj;
      var id = await helper.modal.addLayer.fill({
        type: "background"
      })

      styleObj = await helper.getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": 'background'
        },
      ]);

      await driver.click(wd.$("layer-list-item:"+id+":delete", ""))

      styleObj = await helper.getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
      ]);
    });

    it("duplicate", async function() {
      var styleObj;
      var id = await helper.modal.addLayer.fill({
        type: "background"
      })

      styleObj = await helper.getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": 'background'
        },
      ]);

      await driver.click(wd.$("layer-list-item:"+id+":copy", ""));

      styleObj = await helper.getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": id+"-copy",
          "type": "background"
        },
        {
          "id": id,
          "type": "background"
        },
      ]);
    });

    it("hide", async function() {
      var styleObj;
      var id = await helper.modal.addLayer.fill({
        type: "background"
      })

      styleObj = await helper.getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": 'background'
        },
      ]);

      await driver.click(wd.$("layer-list-item:"+id+":toggle-visibility", ""));

      styleObj = await helper.getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": "background",
          "layout": {
            "visibility": "none"
          }
        },
      ]);

      await driver.click(wd.$("layer-list-item:"+id+":toggle-visibility", ""));

      styleObj = await helper.getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": "background",
          "layout": {
            "visibility": "visible"
          }
        },
      ]);
    })
  })


  describe('background', function () {

    it("add", async function() {
      var id = await helper.modal.addLayer.fill({
        type: "background"
      })

      var styleObj = await helper.getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": 'background'
        }
      ]);
    });

    describe("modify", function() {
      async function createBackground() {
        // Setup
        var id = uuid();

        const selectBox = await $(wd.$("add-layer.layer-type", "select"));
        await selectBox.selectByAttribute('value', "background");
        await browser.flushReactUpdates();
        await browser.setValueSafe(wd.$("add-layer.layer-id", "input"), "background:"+id);

        await driver.click(wd.$("add-layer"));

        var styleObj = await helper.getStyleStore(browser);
        assert.deepEqual(styleObj.layers, [
          {
            "id": 'background:'+id,
            "type": 'background'
          }
        ]);
        return id;
      }

      // ====> THESE SHOULD BE FROM THE SPEC
      describe("layer", function() {
        it("expand/collapse");
        it("id", async function() {
          var bgId = await createBackground();

          await driver.click(wd.$("layer-list-item:background:"+bgId));

          var id = uuid();
          await browser.setValueSafe(wd.$("layer-editor.layer-id", "input"), "foobar:"+id)
          await driver.click(wd.$("min-zoom"));

          var styleObj = await helper.getStyleStore(browser);
          assert.deepEqual(styleObj.layers, [
            {
              "id": 'foobar:'+id,
              "type": 'background'
            }
          ]);
        });

        it("min-zoom", async function() {
          var bgId = await createBackground();

          await driver.click(wd.$("layer-list-item:background:"+bgId));
          await browser.setValueSafe(wd.$("min-zoom", 'input[type="text"]'), 1)

          await driver.click(wd.$("layer-editor.layer-id", "input"));

          var styleObj = await helper.getStyleStore(browser);
          assert.deepEqual(styleObj.layers, [
            {
              "id": 'background:'+bgId,
              "type": 'background',
              "minzoom": 1
            }
          ]);

          // AND RESET!
          // await browser.setValueSafe(wd.$("min-zoom", "input"), "")
          // await browser.click(wd.$("max-zoom", "input"));

          // var styleObj = await helper.getStyleStore(browser);

          // assert.deepEqual(styleObj.layers, [
          //   {
          //     "id": 'background:'+bgId,
          //     "type": 'background'
          //   }
          // ]);
        });

        it("max-zoom", async function() {
          var bgId = await createBackground();

          await driver.click(wd.$("layer-list-item:background:"+bgId));
          await browser.setValueSafe(wd.$("max-zoom", 'input[type="text"]'), 1)

          await driver.click(wd.$("layer-editor.layer-id", "input"));

          var styleObj = await helper.getStyleStore(browser);
          assert.deepEqual(styleObj.layers, [
            {
              "id": 'background:'+bgId,
              "type": 'background',
              "maxzoom": 1
            }
          ]);
        });

        it("comments", async function() {
          var bgId = await createBackground();
          var id = uuid();

          await driver.click(wd.$("layer-list-item:background:"+bgId));
          await browser.setValueSafe(wd.$("layer-comment", "textarea"), id);

          await driver.click(wd.$("layer-editor.layer-id", "input"));

          var styleObj = await helper.getStyleStore(browser);
          assert.deepEqual(styleObj.layers, [
            {
              "id": 'background:'+bgId,
              "type": 'background',
              metadata: {
                'maputnik:comment': id
              }
            }
          ]);

          // Unset it again.
          // TODO: This fails
          // await browser.setValueSafe(wd.$("layer-comment", "textarea"), "");
          // await browser.click(wd.$("min-zoom", "input"));
          // await browser.flushReactUpdates();

          // var styleObj = await helper.getStyleStore(browser);
          // assert.deepEqual(styleObj.layers, [
          //   {
          //     "id": 'background:'+bgId,
          //     "type": 'background'
          //   }
          // ]);
        });

        it("color", null, async function() {
          var bgId = await createBackground();

          await driver.click(wd.$("layer-list-item:background:"+bgId));

          await driver.click(wd.$("spec-field:background-color", "input"));
          // await browser.debug();

          var styleObj = await helper.getStyleStore(browser);
          assert.deepEqual(styleObj.layers, [
            {
              "id": 'background:'+bgId,
              "type": 'background'
            }
          ]);

        })
      })

      describe("filter", function() {
        it("expand/collapse");
        it("compound filter");
      })

      describe("paint", function() {
        it("expand/collapse");
        it("color");
        it("pattern");
        it("opacity");
      })
      // <=====

      describe("json-editor", function() {
        it("expand/collapse");
        it("modify");

        // TODO
        it.skip("parse error", async function() {
          var bgId = await createBackground();

          await browser.click(wd.$("layer-list-item:background:"+bgId));

          var errorSelector = ".CodeMirror-lint-marker-error";
          assert.equal(await browser.isExisting(errorSelector), false);

          await browser.click(".CodeMirror")
          await browser.keys("\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013 {");
          await browser.waitForExist(errorSelector)

          await browser.click(wd.$("layer-editor.layer-id"));
        });
      });
    })
  });

  describe('fill', function () {
    it("add", async function() {
      // await browser.debug();

      var id = await helper.modal.addLayer.fill({
        type: "fill",
        layer: "example"
      });

      var styleObj = await helper.getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": 'fill',
          "source": "example"
        }
      ]);
    })

    // TODO: Change source
    it("change source")
  });

  describe('line', function () {
    it("add", async function() {
      var id = await helper.modal.addLayer.fill({
        type: "line",
        layer: "example"
      });

      var styleObj = await helper.getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": "line",
          "source": "example",
        }
      ]);
    });

    it("groups", null, function() {
      // TODO
      // Click each of the layer groups.
    })
  });

  describe('symbol', function () {
    it("add", async function() {
      var id = await helper.modal.addLayer.fill({
        type: "symbol",
        layer: "example"
      });

      var styleObj = await helper.getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": "symbol",
          "source": "example",
        }
      ]);
    });
  });

  describe('raster', function () {
    it("add", async function() {
      var id = await helper.modal.addLayer.fill({
        type: "raster",
        layer: "raster"
      });

      var styleObj = await helper.getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": "raster",
          "source": "raster",
        }
      ]);
    });
  });

  describe('circle', function () {
    it("add", async function() {
      var id = await helper.modal.addLayer.fill({
        type: "circle",
        layer: "example"
      });

      var styleObj = await helper.getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": "circle",
          "source": "example",
        }
      ]);
    });

  });

  describe('fill extrusion', function () {
    it("add", async function() {
      var id = await helper.modal.addLayer.fill({
        type: "fill-extrusion",
        layer: "example"
      });

      var styleObj = await helper.getStyleStore(browser);
      assert.deepEqual(styleObj.layers, [
        {
          "id": id,
          "type": 'fill-extrusion',
          "source": "example"
        }
      ]);
    });
  });


  describe("groups", function() {
    it("simple", async function() {
      await browser.url(config.baseUrl+"?debug&style="+helper.getStyleUrl([
        "geojson:example"
      ]));
      await browser.acceptAlert(); 

      await helper.modal.addLayer.open();
      await helper.modal.addLayer.fill({
        id: "foo",
        type: "background"
      })

      await helper.modal.addLayer.open();
      await helper.modal.addLayer.fill({
        id: "foo_bar",
        type: "background"
      })

      await helper.modal.addLayer.open();
      await helper.modal.addLayer.fill({
        id: "foo_bar_baz",
        type: "background"
      })

      const groupEl = await $(wd.$("layer-list-group:foo-0"));
      await groupEl.isDisplayed();

      assert.equal(await (await $(wd.$("layer-list-item:foo"))).isDisplayedInViewport(), true);
      assert.equal(await (await $(wd.$("layer-list-item:foo_bar"))).isDisplayedInViewport(), false);
      assert.equal(await (await $(wd.$("layer-list-item:foo_bar_baz"))).isDisplayedInViewport(), false);

      await groupEl.click();

      assert.equal(await (await $(wd.$("layer-list-item:foo"))).isDisplayedInViewport(), true);
      assert.equal(await (await $(wd.$("layer-list-item:foo_bar"))).isDisplayedInViewport(), true);
      assert.equal(await (await $(wd.$("layer-list-item:foo_bar_baz"))).isDisplayedInViewport(), true);
    })
  })
});
