var assert = require("assert");
var helper = require("../helper");
var driver = require("../driver");


describe("history", function() {
  let undoKeyCombo;
  let undoKeyComboReset;
  let redoKeyCombo;
  let redoKeyComboReset;

  before(async function() {
    const isMac = await driver.isMac();
    undoKeyCombo = ['Meta', 'z'];
    undoKeyComboReset = ['Meta'];
    redoKeyCombo = isMac ? ['Meta', 'Shift', 'z'] : ['Meta', 'y'];
    redoKeyComboReset = isMac ? ['Meta', 'Shift'] : ['Meta'];
  });

  /**
   * See <https://github.com/webdriverio/webdriverio/issues/1126>
   */
  it.skip("undo/redo", async function() {
    var styleObj;

    await driver.setStyle(["geojson:example"])
    await helper.modal.addLayer.open();

    styleObj = await helper.getStyleStore(browser);
    assert.deepEqual(styleObj.layers, []);

    await helper.modal.addLayer.fill({
      id: "step 1",
      type: "background"
    })

    styleObj = await helper.getStyleStore(browser);
    assert.deepEqual(styleObj.layers, [
      {
        "id": "step 1",
        "type": 'background'
      }
    ]);

    await helper.modal.addLayer.open();
    await helper.modal.addLayer.fill({
      id: "step 2",
      type: "background"
    })

    styleObj = await helper.getStyleStore(browser);
    assert.deepEqual(styleObj.layers, [
      {
        "id": "step 1",
        "type": 'background'
      },
      {
        "id": "step 2",
        "type": 'background'
      }
    ]);

    await driver.typeKeys(undoKeyCombo);
    await driver.typeKeys(undoKeyComboReset);
    styleObj = await helper.getStyleStore(browser);
    assert.deepEqual(styleObj.layers, [
      {
        "id": "step 1",
        "type": 'background'
      }
    ]);

    await driver.typeKeys(undoKeyCombo)
    await driver.typeKeys(undoKeyComboReset);
    styleObj = await helper.getStyleStore(browser);
    assert.deepEqual(styleObj.layers, [
    ]);

    await driver.typeKeys(redoKeyCombo)
    await driver.typeKeys(redoKeyComboReset);
    styleObj = await helper.getStyleStore(browser);
    assert.deepEqual(styleObj.layers, [
      {
        "id": "step 1",
        "type": 'background'
      }
    ]);

    await driver.typeKeys(redoKeyCombo)
    await driver.typeKeys(redoKeyComboReset);
    styleObj = await helper.getStyleStore(browser);
    assert.deepEqual(styleObj.layers, [
      {
        "id": "step 1",
        "type": 'background'
      },
      {
        "id": "step 2",
        "type": 'background'
      }
    ]);

  });

})
