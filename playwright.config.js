// @ts-check

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
    use: {
        baseURL: 'http://localhost:8080',
    },
    workers: 1
};

module.exports = config;