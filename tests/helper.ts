import { Locator, Page } from '@playwright/test';

const pokemon = (root: Locator, i: number) => {
    const $ = root.locator(`#pokemon${i}`);
    const name = $.locator('.pokemon-name');
    const types = async () => {
        const blocks = await $.locator('.pokemon-info').locator('.type-block').elementHandles();
        return await Promise.all(blocks.map(e => e.textContent()));
    };
    const ability = $.locator('.pokemon-ability');
    return {
        $,
        name,
        types,
        ability
    };
};

const typeGrade = async (root: Locator, type: string) => {
    const $ = root.locator(`.type-grade.${type}`);
    const effects = await (async () => {
        const blocks = await $.locator('.effects .benefit').elementHandles();
        return await Promise.all(blocks.map(e => e.textContent()));
    })();

    const benefactors = await (async () => {
        const blocks = await $.locator('.benefactors .pokemon').elementHandles();
        return await Promise.all(blocks.map(async e => {
            const name = await (await e.$('img'))?.getAttribute('title');
            const offense = await e.textContent()
            return {
                name,
                offense
            };
        }));
    })();

    const detractors = await (async () => {
        const blocks = await $.locator('.detractors .pokemon').elementHandles();
        return await Promise.all(blocks.map(async e => {
            const name = await (await e.$('img'))?.getAttribute('title');
            const vuln = await e.textContent()
            return {
                name,
                vuln
            };
        }));
    })();

    return {
        $,
        data: {
            effects,
            benefactors,
            detractors
        }
    }
}

export const helper = (page: Page) => {
    return {
        header: () => page.locator("header h1"),
        footer: () => page.locator("footer"),
        twitter: () => page.locator("#twitter"),
        report: () => page.locator("#report"),
        team: () => {
            const $ = page.locator("#pokemon-team");
            const title = $.locator('h2');

            return {
                $,
                title,
                pokemon1: pokemon($, 1),
                pokemon2: pokemon($, 2),
                pokemon3: pokemon($, 3),
                pokemon4: pokemon($, 4),
                pokemon5: pokemon($, 5),
                pokemon6: pokemon($, 6),
            };
        },
        teamChart: () => {
            const $ = page.locator("#pokemon-team-chart");
            const title = $.locator('h2');
            return {
                $,
                title
            };
        },
        reportCard: () => {
            const $ = page.locator('#pokemon-report-card');
            const title = $.locator('h2');
            const offense = $.locator('#offense-grade h3');
            const safety = $.locator('#safety-grade h3');
            return {
                $,
                title,
                offense,
                safety,
                typeGrades: {
                    normal: () => typeGrade($, 'normal'),
                    fire: () => typeGrade($, 'fire'),
                    water: () => typeGrade($, 'water'),
                    electric: () => typeGrade($, 'electric'),
                    grass: () => typeGrade($, 'grass'),
                    ice: () => typeGrade($, 'ice'),
                    fighting: () => typeGrade($, 'fighting'),
                    poison: () => typeGrade($, 'poison'),
                    ground: () => typeGrade($, 'ground'),
                    flying: () => typeGrade($, 'flying'),
                    psychic: () => typeGrade($, 'psychic'),
                    bug: () => typeGrade($, 'bug'),
                    rock: () => typeGrade($, 'rock'),
                    ghost: () => typeGrade($, 'ghost'),
                    dragon: () => typeGrade($, 'dragon'),
                    dark: () => typeGrade($, 'dark'),
                    steel: () => typeGrade($, 'steel'),
                    fairy: () => typeGrade($, 'fairy'),
                }
            };
        }
    }
};
