
const testNetwork = process.env.TEST_NETWORK || "localhost";
const port = 9001;
const baseUrl = "http://"+config.testNetwork+":"+config.port;
const config = {
    testNetwork,
    port,
    baseUrl
};

module.exports = config;
