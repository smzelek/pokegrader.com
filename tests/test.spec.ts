import { test, expect, Page } from '@playwright/test';
import { helper } from './helper';
import allPokemon from './mockData/allPokemon.json';
import gastrodon from './mockData/gastrodon.json';
import azumarill from './mockData/azumarill.json';
import houndoom from './mockData/houndoom.json';
import drakloak from './mockData/drakloak.json';
import carkol from './mockData/carkol.json';
import magneton from './mockData/magneton.json';
import { verifyPartialTeamReportCard } from './verifyPartialTeam';
import { verifyFullTeamReportCard } from './verifyFullTeam';

let page: Page;

export const _ensurePageLoaded = () => {
  test.describe('the page loads', () => {
    test("clears the browser url", async () => {
      await expect(page).toHaveURL('http://localhost:8080');
    });

    test("displays the title in the browser", async () => {
      const title = await page.title();
      expect(title).toBe("PokéGrader.js");
    });

    test("shows credit in the footer", async () => {
      const { footer } = helper(page);
      await expect(footer()).toBeVisible();
      await expect(footer()).toHaveText("coded by Steve Zelek using Preact");
    });

    test("shows the header of the app", async () => {
      const { header } = helper(page);

      await expect(header()).toBeVisible();
      await expect(header()).toHaveText("pokégrader");
    });

    test("shows all 3 blocks", async () => {
      const { team, teamChart, reportCard } = helper(page);

      await expect(team().$).toBeVisible();
      await expect(team().title).toHaveText("choose your team:");

      await expect(teamChart().$).toBeVisible();
      await expect(teamChart().title).toHaveText("see their matchups...");

      await expect(reportCard().$).toBeVisible();
      await expect(reportCard().title).toHaveText("get your grade!");

      await expect(reportCard().power).toBeVisible();
      await expect(reportCard().power).toContainText('%');
      await expect(reportCard().safety).toBeVisible();
      await expect(reportCard().safety).toContainText('%');
    });
  });
};

test.describe("tests", () => {
  test.describe.configure({ mode: 'serial' });

  test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshotPath = `./screenshots/${testInfo.title}.png`;
      testInfo.attachments.push({ name: 'screenshot', path: screenshotPath, contentType: 'image/png' });
      await page.screenshot({ path: screenshotPath, timeout: 5000 });
    }
  });

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.route('**/*', route => {
      // Silently abort unmocked API requests
      if (['fetch'].includes(route.request().resourceType())) {
        return route.abort();
      }
      return route.continue();
    });
    await page.route('**/api/v2/pokemon?limit=1154', route => route.fulfill({
      status: 200,
      body: JSON.stringify(allPokemon),
    }));
    await page.route('**/api/v2/pokemon/gastrodon', route => route.fulfill({
      status: 200,
      body: JSON.stringify(gastrodon),
    }));
    await page.route('**/api/v2/pokemon/azumarill', route => route.fulfill({
      status: 200,
      body: JSON.stringify(azumarill),
    }));
    await page.route('**/api/v2/pokemon/houndoom', route => route.fulfill({
      status: 200,
      body: JSON.stringify(houndoom),
    }));
    await page.route('**/api/v2/pokemon/drakloak', route => route.fulfill({
      status: 200,
      body: JSON.stringify(drakloak),
    }));
    await page.route('**/api/v2/pokemon/carkol', route => route.fulfill({
      status: 200,
      body: JSON.stringify(carkol),
    }));
    await page.route('**/api/v2/pokemon/magneton', route => route.fulfill({
      status: 200,
      body: JSON.stringify(magneton),
    }));
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.describe("loading blank page", () => {
    test.beforeAll(async () => {
      // only load pokemon list once
      await page.goto('/');
    });

    _ensurePageLoaded();

    test("shows empty report card", async () => {
      const { reportCard } = helper(page);
      await expect(reportCard().power).toContainText('0%');
      await expect(reportCard().safety).toContainText('0%');

      expect(reportCard().$.locator('.type-grade')).not.toBeVisible();
    })
  });

  test.describe("loading full roster from query parameters", () => {
    test.beforeEach(async () => {
      await page.goto('/?p=0.423.0&p=1.184.0&p=2.229.0&p=3.886&p=4.82&p=5.838.0');
    });

    _ensurePageLoaded();

    test("loads name, types, and chosen ability", async () => {
      const { team } = helper(page);
      await expect(team().pokemon1.name).toHaveText('Gastrodon');
      await expect(team().pokemon2.name).toHaveText('Azumarill');
      await expect(team().pokemon3.name).toHaveText('Houndoom');
      await expect(team().pokemon4.name).toHaveText('Drakloak');
      await expect(team().pokemon5.name).toHaveText('Magneton');
      await expect(team().pokemon6.name).toHaveText('Carkol');

      expect(await team().pokemon1.types()).toEqual(['wtr', 'grn']);
      expect(await team().pokemon2.types()).toEqual(['wtr', 'fai']);
      expect(await team().pokemon3.types()).toEqual(['drk', 'fir']);
      expect(await team().pokemon4.types()).toEqual(['dgn', 'gho']);
      expect(await team().pokemon5.types()).toEqual(['ele', 'stl']);
      expect(await team().pokemon6.types()).toEqual(['rck', 'fir']);

      await expect(team().pokemon1.ability).toHaveText('Storm Drain');
      await expect(team().pokemon2.ability).toHaveText('Thick Fat');
      await expect(team().pokemon3.ability).toHaveText('Flash Fire');
      await expect(team().pokemon4.ability).toHaveText('');
      await expect(team().pokemon5.ability).toHaveText('');
      await expect(team().pokemon6.ability).toHaveText('Flash Fire');
    });

    test("calculates proper grades", async () => {
      const { reportCard } = helper(page);
      await expect(reportCard().power).toContainText('97%');
      await expect(reportCard().safety).toContainText('94%');

      await verifyFullTeamReportCard(reportCard);
    });
  });

  test.describe("loading partial roster from query parameters", () => {
    test.beforeEach(async () => {
      await page.goto('/?p=0.423.0&p=1.184.0&p=2.229&p=4.82&p=5.838.0');
    });

    _ensurePageLoaded();

    test("loads in right slots via indexes in params", async () => {
      const { team } = helper(page);
      await expect(team().pokemon1.name).toHaveText('Gastrodon');
      await expect(team().pokemon2.name).toHaveText('Azumarill');
      await expect(team().pokemon3.name).toHaveText('Houndoom');
      await expect(team().pokemon4.name).toHaveText('');
      await expect(team().pokemon5.name).toHaveText('Magneton');
      await expect(team().pokemon6.name).toHaveText('Carkol');

      expect(await team().pokemon1.types()).toEqual(['wtr', 'grn']);
      expect(await team().pokemon2.types()).toEqual(['wtr', 'fai']);
      expect(await team().pokemon3.types()).toEqual(['drk', 'fir']);
      expect(await team().pokemon4.types()).toEqual([]);
      expect(await team().pokemon5.types()).toEqual(['ele', 'stl']);
      expect(await team().pokemon6.types()).toEqual(['rck', 'fir']);

      await expect(team().pokemon1.ability).toHaveText('Storm Drain');
      await expect(team().pokemon2.ability).toHaveText('Thick Fat');
      await expect(team().pokemon3.ability).toHaveText('');
      await expect(team().pokemon4.ability).toHaveText('');
      await expect(team().pokemon5.ability).toHaveText('');
      await expect(team().pokemon6.ability).toHaveText('Flash Fire');
    });

    // also should check that the teamchart rows are in the right order 

    test("calculates proper grades", async () => {
      const { reportCard } = helper(page);
      await expect(reportCard().power).toContainText('94%');
      await expect(reportCard().safety).toContainText('88%');
      await verifyPartialTeamReportCard(reportCard);
    });
  });

  test.describe("external urls append proper query params", () => {
    let callUrl: string | undefined;
    const mockOpen = (s: string) => {
      callUrl = s;
      return false;
    };

    test.beforeAll(async () => {
      await page.exposeFunction('mockOpen', mockOpen);
    });

    test.describe("twitter", () => {
      test("partial team url", async () => {
        const { twitter, reportCard } = helper(page);
        const initialUrl = 'http://localhost:8080/?p=0.423.0&p=1.184.0&p=2.229&p=4.82&p=5.838.0'
        await page.goto(initialUrl);
        await expect(reportCard().power).toContainText('94%'); // wait for team rendered

        callUrl = undefined;
        await page.evaluate(() => {
          window.open = mockOpen as any;
        });
        await twitter().click();

        const encodedUrl = encodeURIComponent(initialUrl);
        expect(callUrl).toBe(`https://twitter.com/intent/tweet?text=check+out+my+pokemon+teams+score%21%21%0A${encodedUrl}`);
      });

      test("full team url", async () => {
        const { twitter, reportCard } = helper(page);
        const initialUrl = 'http://localhost:8080/?p=0.423.0&p=1.184.0&p=2.229.0&p=3.886&p=4.82&p=5.838.0'
        await page.goto(initialUrl);
        await expect(reportCard().power).toContainText('97%'); // wait for team rendered

        callUrl = undefined;
        await page.evaluate(() => {
          window.open = mockOpen as any;
        });
        await twitter().click();

        const encodedUrl = encodeURIComponent(initialUrl);
        expect(callUrl).toBe(`https://twitter.com/intent/tweet?text=check+out+my+pokemon+teams+score%21%21%0A${encodedUrl}`);
      });
    });

    test.describe("google forms", () => {
      test("partial team url", async () => {
        const { report, reportCard } = helper(page);
        const initialUrl = 'http://localhost:8080/?p=0.423.0&p=1.184.0&p=2.229&p=4.82&p=5.838.0'
        await page.goto(initialUrl);
        await expect(reportCard().power).toContainText('94%'); // wait for team rendered

        callUrl = undefined;
        await page.evaluate(() => {
          window.open = mockOpen as any;
        });
        await report().click();

        const encodedUrl = encodeURIComponent(initialUrl);
        expect(callUrl).toBe(`https://docs.google.com/forms/d/e/1FAIpQLScrbjDLotIHBnqD06RYZfdpLA7U_d1H4TJ0g4L5qro8g8GaEw/viewform?usp=pp_url&entry.368646608=${encodedUrl}`);
      });

      test("full team url", async () => {
        const { report, reportCard } = helper(page);
        const initialUrl = 'http://localhost:8080/?p=0.423.0&p=1.184.0&p=2.229.0&p=3.886&p=4.82&p=5.838.0'
        await page.goto(initialUrl);
        await expect(reportCard().power).toContainText('97%'); // wait for team rendered

        callUrl = undefined;
        await page.evaluate(() => {
          window.open = mockOpen as any;
        });
        await report().click();

        const encodedUrl = encodeURIComponent(initialUrl);
        expect(callUrl).toBe(`https://docs.google.com/forms/d/e/1FAIpQLScrbjDLotIHBnqD06RYZfdpLA7U_d1H4TJ0g4L5qro8g8GaEw/viewform?usp=pp_url&entry.368646608=${encodedUrl}`);
      });
    });
  });
});