import { JSX } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks'
import { Types } from './pokegrader';

export type JSXChildren = (string | number | JSX.Element) | (string | number | JSX.Element)[];

export const scaleDecimal = (num: number, scale: number): number => {
    return Math.floor(num * scale);
};

export type Rank = 'best' | 'good' | 'decent' | 'unimportant' | 'poor' | 'bad' | 'na' | '';

export const effectivenessRank = (decimal: number): Rank => {
    if (decimal >= 2) {
        return "good"
    }
    if (decimal >= 1) {
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
        return "best"
    }
    if (decimal >= 4) {
        return "good"
    }
    if (decimal >= 2) {
        return "decent"
    }
    if (decimal >= 1) {
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

export const toSearchable = (s: string): string => s.replaceAll(/[\W]+/g, '').toLowerCase();

export const useAsync = <T, K extends T>(getMethod: () => Promise<T>, deps: any[] = [], { initialValue }: { initialValue: K }) => {
    const [value, setValue] = useState<T>(initialValue);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

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
