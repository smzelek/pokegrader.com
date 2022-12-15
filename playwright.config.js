// @ts-check

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
    projects: [
        {
            use: {
                baseURL: 'http://localhost:8080',
                viewport: {
                    width: 1920,
                    height: 1080
                }
            },
        },
        {
            use: {
                baseURL: 'http://localhost:8080',
                viewport: {
                    width: 500,
                    height: 900
                }
            },
        }
    ],
    workers: 1,
};

module.exports = config;