import { JSX } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks'
import { Types } from './types';

export type JSXChildren = (string | number | JSX.Element) | (string | number | JSX.Element)[];

export const product = (arr: (number | undefined)[]): number => arr.reduce((a: number, b) => {
    if (b === undefined) {
        return a;
    }
    return a * b;
}, 1) as number;

export type FractionParts = { numerator: number, denominator: number };
const reduceFraction = ({ numerator, denominator }: FractionParts): FractionParts => {
    const gcd = (a: number, b: number): number => {
        return b ? gcd(b, a % b) : a;
    };
    const divisor = gcd(numerator, denominator);
    return { numerator: numerator / divisor, denominator: denominator / divisor };
};

const getFirstSigPlace = (num: number): number => {
    if (!String(num).includes('.')) {
        return Infinity;
    }
    return Math.ceil(-Math.log10(num))
};

const getFraction = (dec: number, m: number): FractionParts => {
    if (getFirstSigPlace(m * dec) > 5) {
        return { numerator: m * dec, denominator: m };
    }
    if (m > 32) {
        return reduceFraction({ numerator: Math.floor(m * 32), denominator: 32 })
    }
    return getFraction(dec, m + 1);
};

export const handleFraction = (number: number | FractionParts | undefined): number | FractionParts | undefined => {
    if (number === undefined) {
        return undefined;
    }
    if (typeof number === "object") {
        return number;
    }
    if (!String(number).includes('.')) {
        return number;
    }
    return getFraction(number, 1);
};

export const scaleDecimal = (num: number, scale: number): number => {
    return Math.floor(num * scale);
};

export type Rank = 'best' | 'great' | 'good' | 'decent' | 'unimportant' | 'poor' | 'bad' | 'na' | '';

export const vulnerabilityRank = (decimal: number | undefined): Rank => {
    if (decimal === undefined) {
        return "";
    }
    if (decimal === 0) {
        return "best";
    }
    if (decimal < 1) {
        return "good";
    }
    if (decimal === 1) {
        return "unimportant";
    }
    return "poor";
}

export const effectivenessRank = (decimal: number | undefined): Rank => {
    if (decimal === undefined) {
        return "";
    }
    if (decimal > 1) {
        return "good"
    }
    if (decimal === 1) {
        return "unimportant"
    }
    if (decimal >= 0) {
        return "poor"
    }
    if (decimal === 0) {
        return "na"
    }
    return "";
}

export const vulnerabilityCountRank = (decimal: number): Rank => {
    if (decimal >= 3) {
        return "bad";
    }
    if (decimal >= 2) {
        return "poor";
    }
    return "unimportant";
};

export const relativeStrengthRank = (decimal: number | undefined): Rank => {
    if (decimal === undefined) {
        return "";
    }
    if (decimal === Infinity) {
        return "best"
    }
    if (decimal >= 8) {
        return "great"
    }
    if (decimal >= 4) {
        return "good"
    }
    if (decimal > 1) {
        return "decent"
    }
    if (decimal === 1) {
        return "unimportant"
    }
    if (decimal > 0) {
        return "poor"
    }
    if (decimal === 0) {
        return "na";
    }
    return "";
}

export const toShortTypes = (t: Types): string => {
    if (t === 'fighting') {
        return 'fht'
    }
    if (t === 'poison') {
        return 'psn'
    }
    if (t === 'rock') {
        return 'rck'
    }
    if (t === 'grass') {
        return 'grs'
    }
    if (t === 'ground') {
        return 'grn'
    }
    if (t === 'dragon') {
        return 'dgn'
    }
    if (t === 'steel') {
        return 'stl'
    }
    if (t === 'dark') {
        return 'drk';
    }
    if (t === 'water') {
        return 'wtr';
    }
    return t.substring(0, 3)
}

export const toTitleCase = (s: string): string => [s[0]?.toUpperCase(), ...s.slice(1)].join('');

export const toSearchable = (s: string): string => s.replace(/[\W]+/g, '').toLowerCase();

export const useAsync = <T, K extends T>(getMethod: () => Promise<T>, deps: any[] = [], { initialValue }: { initialValue: K }) => {
    const [value, setValue] = useState<T>(initialValue);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const callback = useCallback(getMethod, deps);

    useEffect(() => {
        async function getResource() {
            try {
                setLoading(true);
                const result = await callback();
                setValue(result);
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        }
        getResource();
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [...deps, callback]);

    return { value, error, loading };
}
