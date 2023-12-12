import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import webpackConfig from "../../config/webpack.config";
import testConfig from "./specs";
import artifacts from "../artifacts";


var server;
var SCREENSHOT_PATH = artifacts.pathSync("screenshots");

export const config = {
  runner: 'local',
  path: '/wd/hub',

  specs: [
    './test/functional/index.js'
  ],
  maxInstances: 10,
  capabilities: [
    {
      maxInstances: 5,
      browserName: (process.env.BROWSER || 'chrome'),
      'goog:chromeOptions': {
        args: ['headless=new']
      }
    }
  ],
  // geckodriver-0.31 seems to have problems as of 2022 May 1
  services: process.env.DOCKER_HOST ? [] : [ ['selenium-standalone', { drivers: { firefox: 'latest', chrome: 'latest' } } ] ],
  logLevel: 'info',
  bail: 0,
  screenshotPath: SCREENSHOT_PATH,
  hostname: process.env.DOCKER_HOST || "0.0.0.0",
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    // Because we don't know how long the initial build will take...
    timeout: 4*60*1000,
  },
  onPrepare: async function (config, capabilities) {
    webpackConfig.devServer.host = testConfig.testNetwork;
    webpackConfig.devServer.port = testConfig.port;
    const compiler = webpack(webpackConfig);
    server = new WebpackDevServer(webpackConfig.devServer, compiler);
    await server.start();
  },
  onComplete: async function (exitCode, config, capabilities) {
    await server.stop();
  }
}
