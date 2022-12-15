import { expect } from '@playwright/test';
import { helper } from './helper';

export const verifyFullTeamReportCard = async (reportCard: ReturnType<typeof helper>['reportCard']) => {

    expect((await reportCard().typeGrades.normal()).data).toEqual({
        benefactors: [{ name: 'Drakloak', power: '∞' },],
        detractors: [],
        effects: [],
    });

    expect((await reportCard().typeGrades.fire()).data).toEqual({
        benefactors: [
            { name: 'Houndoom', power: '∞' },
            { name: 'Carkol', power: '∞' },
            { name: 'Azumarill', power: '8' },
            { name: 'Gastrodon', power: '4' },
        ],
        detractors: [
            { name: 'Magneton', vuln: '1/2' },
        ],
        effects: [],
    });

    expect((await reportCard().typeGrades.water()).data).toEqual({
        benefactors: [
            { name: 'Gastrodon', power: '∞' },
            { name: 'Azumarill', power: '2' },
        ],
        detractors: [
            { name: 'Carkol', vuln: '1/4' },
            { name: 'Houndoom', vuln: '1/2' },
        ],
        effects: [],
    });

    expect((await reportCard().typeGrades.electric()).data).toEqual({
        benefactors: [
            { name: 'Gastrodon', power: '∞' },
        ],
        detractors: [
            { name: 'Azumarill', vuln: '1/2' },
        ],
        effects: [],
    });

    expect((await reportCard().typeGrades.grass()).data).toEqual({
        benefactors: [
            { name: 'Houndoom', power: '4' },
            { name: 'Drakloak', power: '2' },
        ],
        detractors: [
            { name: 'Gastrodon', vuln: '1/8' },
            { name: 'Azumarill', vuln: '1/2' },
        ],
        effects: [],
    });

    expect((await reportCard().typeGrades.ice()).data).toEqual({
        benefactors: [
            { name: 'Azumarill', power: '4' },
            { name: 'Houndoom', power: '4' },
            { name: 'Magneton', power: '4' },
            { name: 'Carkol', power: '4' },
        ],
        detractors: [
            { name: 'Drakloak', vuln: '1/2' }
        ],
        effects: [],
    });

    expect((await reportCard().typeGrades.fighting()).data).toEqual({
        benefactors: [
            { name: 'Drakloak', power: '∞' },
            { name: 'Azumarill', power: '4' },
            { name: 'Gastrodon', power: '1' },
        ],
        detractors: [
            { name: 'Houndoom', vuln: '1/2' },
            { name: 'Magneton', vuln: '1/2' },
            { name: 'Carkol', vuln: '1/2' },
        ],
        effects: ['-2% safety'],
    });

    expect((await reportCard().typeGrades.poison()).data).toEqual({
        benefactors: [
            { name: 'Magneton', power: '∞' },
            { name: 'Gastrodon', power: '4' },
        ],
        detractors: [
            { name: 'Azumarill', vuln: '1/2' },
        ],
        effects: [],
    });

    expect((await reportCard().typeGrades.ground()).data).toEqual({
        benefactors: [
            { name: 'Gastrodon', power: '2' },
            { name: 'Azumarill', power: '2' },
            { name: 'Drakloak', power: '1' },
        ],
        detractors: [
            { name: 'Magneton', vuln: '1/4' },
            { name: 'Carkol', vuln: '1/4' },
            { name: 'Houndoom', vuln: '1/2' },
        ],
        effects: ['-2% power', '-2% safety'],
    });

    expect((await reportCard().typeGrades.flying()).data).toEqual({
        benefactors: [
            { name: 'Magneton', power: '8' },
            { name: 'Carkol', power: '4' },
        ],
        detractors: [],
        effects: [],
    });

    expect((await reportCard().typeGrades.psychic()).data).toEqual({
        benefactors: [
            { name: 'Houndoom', power: '∞' },
        ],
        detractors: [],
        effects: [],
    });

    expect((await reportCard().typeGrades.bug()).data).toEqual({
        benefactors: [
            { name: 'Carkol', power: '4' },
        ],
        detractors: [],
        effects: [],
    });

    expect((await reportCard().typeGrades.rock()).data).toEqual({
        benefactors: [
            { name: 'Gastrodon', power: '4' },
            { name: 'Magneton', power: '4' },
        ],
        detractors: [
            { name: 'Houndoom', vuln: '1/2' },
            { name: 'Carkol', vuln: '1/2' },
        ],
        effects: [],
    });

    expect((await reportCard().typeGrades.ghost()).data).toEqual({
        benefactors: [
            { name: 'Houndoom', power: '4' },
        ],
        detractors: [
            { name: 'Drakloak', vuln: '1' },
        ],
        effects: [],
    });

    expect((await reportCard().typeGrades.dragon()).data).toEqual({
        benefactors: [
            { name: 'Azumarill', power: '∞' },
        ],
        detractors: [
            { name: 'Drakloak', vuln: '1' },
        ],
        effects: [],
    });

    expect((await reportCard().typeGrades.dark()).data).toEqual({
        benefactors: [
            { name: 'Azumarill', power: '4' },
        ],
        detractors: [
            { name: 'Drakloak', vuln: '1/2' },
        ],
        effects: [],
    });

    expect((await reportCard().typeGrades.steel()).data).toEqual({
        benefactors: [
            { name: 'Gastrodon', power: '4' },
            { name: 'Houndoom', power: '4' },
            { name: 'Magneton', power: '4' },
        ],
        detractors: [],
        effects: [],
    });

    expect((await reportCard().typeGrades.fairy()).data).toEqual({
        benefactors: [
            { name: 'Magneton', power: '4' },
        ],
        detractors: [
            { name: 'Drakloak', vuln: '1/2' },
        ],
        effects: [],
    });
}