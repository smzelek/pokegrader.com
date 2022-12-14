import { expect } from '@playwright/test';
import { helper } from './helper';

export const verifyPartialTeamReportCard = async (reportCard: ReturnType<typeof helper>['reportCard']) => {

    expect((await reportCard().typeGrades.normal()).data).toEqual({
        benefactors: [
            { name: 'Magneton', offense: '2' },
            { name: 'Carkol', offense: '2' },
        ],
        detractors: [],
        effects: ['-2% offense'],
    });

    expect((await reportCard().typeGrades.fire()).data).toEqual({
        benefactors: [
            { name: 'Carkol', offense: '∞' },
            { name: 'Azumarill', offense: '8' },
            { name: 'Gastrodon', offense: '4' },
        ],
        detractors: [
            { name: 'Magneton', vuln: '1/2' },
        ],
        effects: [],
    });

    expect((await reportCard().typeGrades.water()).data).toEqual({
        benefactors: [
            { name: 'Gastrodon', offense: '∞' },
            { name: 'Azumarill', offense: '2' },
        ],
        detractors: [
            { name: 'Carkol', vuln: '1/4' },
            { name: 'Houndoom', vuln: '1/2' },
        ],
        effects: [],
    });

    expect((await reportCard().typeGrades.electric()).data).toEqual({
        benefactors: [
            { name: 'Gastrodon', offense: '∞' },
        ],
        detractors: [
            { name: 'Azumarill', vuln: '1/2' },
        ],
        effects: [],
    });

    expect((await reportCard().typeGrades.grass()).data).toEqual({
        benefactors: [
            { name: 'Houndoom', offense: '4' },
            { name: 'Magneton', offense: '2' },
        ],
        detractors: [
            { name: 'Gastrodon', vuln: '1/8' },
            { name: 'Azumarill', vuln: '1/2' },
        ],
        effects: [],
    });

    expect((await reportCard().typeGrades.ice()).data).toEqual({
        benefactors: [
            { name: 'Azumarill', offense: '4' },
            { name: 'Houndoom', offense: '4' },
            { name: 'Magneton', offense: '4' },
            { name: 'Carkol', offense: '4' },
        ],
        detractors: [],
        effects: [],
    });

    expect((await reportCard().typeGrades.fighting()).data).toEqual({
        benefactors: [
            { name: 'Azumarill', offense: '4' },
            { name: 'Gastrodon', offense: '1' },
        ],
        detractors: [
            { name: 'Houndoom', vuln: '1/2' },
            { name: 'Magneton', vuln: '1/2' },
            { name: 'Carkol', vuln: '1/2' },
        ],
        effects: ['-5% safety'],
    });

    expect((await reportCard().typeGrades.poison()).data).toEqual({
        benefactors: [
            { name: 'Magneton', offense: '∞' },
            { name: 'Gastrodon', offense: '4' },
        ],
        detractors: [
            { name: 'Azumarill', vuln: '1/2' },
        ],
        effects: [],
    });

    expect((await reportCard().typeGrades.ground()).data).toEqual({
        benefactors: [
            { name: 'Gastrodon', offense: '2' },
            { name: 'Azumarill', offense: '2' },
        ],
        detractors: [
            { name: 'Magneton', vuln: '1/4' },
            { name: 'Carkol', vuln: '1/4' },
            { name: 'Houndoom', vuln: '1/2' },
        ],
        effects: ['-2% offense', '-5% safety'],
    });

    expect((await reportCard().typeGrades.flying()).data).toEqual({
        benefactors: [
            { name: 'Magneton', offense: '8' },
            { name: 'Carkol', offense: '4' },
        ],
        detractors: [],
        effects: [],
    });

    expect((await reportCard().typeGrades.psychic()).data).toEqual({
        benefactors: [
            { name: 'Houndoom', offense: '∞' },
        ],
        detractors: [],
        effects: [],
    });

    expect((await reportCard().typeGrades.bug()).data).toEqual({
        benefactors: [
            { name: 'Carkol', offense: '4' },
        ],
        detractors: [],
        effects: [],
    });

    expect((await reportCard().typeGrades.rock()).data).toEqual({
        benefactors: [
            { name: 'Gastrodon', offense: '4' },
            { name: 'Magneton', offense: '4' },
        ],
        detractors: [
            { name: 'Houndoom', vuln: '1/2' },
            { name: 'Carkol', vuln: '1/2' },
        ],
        effects: [],
    });

    expect((await reportCard().typeGrades.ghost()).data).toEqual({
        benefactors: [
            { name: 'Houndoom', offense: '4' },
        ],
        detractors: [],
        effects: [],
    });

    expect((await reportCard().typeGrades.dragon()).data).toEqual({
        benefactors: [
            { name: 'Azumarill', offense: '∞' },
        ],
        detractors: [],
        effects: [],
    });

    expect((await reportCard().typeGrades.dark()).data).toEqual({
        benefactors: [
            { name: 'Azumarill', offense: '4' },
        ],
        detractors: [],
        effects: [],
    });

    expect((await reportCard().typeGrades.steel()).data).toEqual({
        benefactors: [
            { name: 'Gastrodon', offense: '4' },
            { name: 'Houndoom', offense: '4' },
            { name: 'Magneton', offense: '4' },
        ],
        detractors: [],
        effects: [],
    });

    expect((await reportCard().typeGrades.fairy()).data).toEqual({
        benefactors: [
            { name: 'Magneton', offense: '4' },
        ],
        detractors: [],
        effects: [],
    });
}