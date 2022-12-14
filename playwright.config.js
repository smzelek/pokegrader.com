// @ts-check

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
    use: {
        baseURL: 'http://localhost:8080',
        headless: false,
    },
};

module.exports = config;