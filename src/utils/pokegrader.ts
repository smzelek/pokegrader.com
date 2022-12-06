import { Pokemon } from "src/api/pokeapi";

export type Types = typeof POKEMON_TYPES[number];
export const POKEMON_TYPES = [
    'normal',
    'fire',
    'water',
    'electric',
    'grass',
    'ice',
    'fighting',
    'poison',
    'ground',
    'flying',
    'psychic',
    'bug',
    'rock',
    'ghost',
    'dragon',
    'dark',
    'steel',
    'fairy'
] as const;

const POKEMON_TYPE_ATK = [
    [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 0.0, 1.0, 1.0, 0.5, 1.0],
    [1.0, 0.5, 0.5, 1.0, 2.0, 2.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 0.5, 1.0, 0.5, 1.0, 2.0, 1.0],
    [1.0, 2.0, 0.5, 1.0, 0.5, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 1.0, 2.0, 1.0, 0.5, 1.0, 1.0, 1.0],
    [1.0, 1.0, 2.0, 0.5, 0.5, 1.0, 1.0, 1.0, 0.0, 2.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0, 1.0],
    [1.0, 0.5, 2.0, 1.0, 0.5, 1.0, 1.0, 0.5, 2.0, 0.5, 1.0, 0.5, 2.0, 1.0, 0.5, 1.0, 0.5, 1.0],
    [1.0, 0.5, 0.5, 1.0, 2.0, 0.5, 1.0, 1.0, 2.0, 2.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 0.5, 1.0],
    [2.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 0.5, 1.0, 0.5, 0.5, 0.5, 2.0, 0.0, 1.0, 2.0, 2.0, 0.5],
    [1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 0.5, 0.5, 1.0, 1.0, 1.0, 0.5, 0.5, 1.0, 1.0, 0.0, 2.0],
    [1.0, 2.0, 1.0, 2.0, 0.5, 1.0, 1.0, 2.0, 1.0, 0.0, 1.0, 0.5, 2.0, 1.0, 1.0, 1.0, 2.0, 1.0],
    [1.0, 1.0, 1.0, 0.5, 2.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 2.0, 0.5, 1.0, 1.0, 1.0, 0.5, 1.0],
    [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 2.0, 1.0, 1.0, 0.5, 1.0, 1.0, 1.0, 1.0, 0.0, 0.5, 1.0],
    [1.0, 0.5, 1.0, 1.0, 2.0, 1.0, 0.5, 0.5, 1.0, 0.5, 2.0, 1.0, 1.0, 0.5, 1.0, 2.0, 0.5, 0.5],
    [1.0, 2.0, 1.0, 1.0, 1.0, 2.0, 0.5, 1.0, 0.5, 2.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0],
    [0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 2.0, 1.0, 0.5, 1.0, 1.0],
    [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 0.5, 0.0],
    [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 2.0, 1.0, 0.5, 1.0, 0.5],
    [1.0, 0.5, 0.5, 0.5, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 1.0, 0.5, 2.0],
    [1.0, 0.5, 1.0, 1.0, 1.0, 1.0, 2.0, 0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 2.0, 0.5, 1.0],
];

const transpose2dArray = <T,>(arr: T[][]) => arr.reduce((acc, cur) => {
    cur.forEach((c, i) => acc[i] = [...(acc[i] || []), c]);
    return acc;
}, <T[][]>[]);

const POKEMON_TYPE_DEF = transpose2dArray(POKEMON_TYPE_ATK.map(row => row.map(atk => {
    if (atk === 0) {
        return Infinity
    }
    return 1 / atk;
})))

export const emptyMatchups = (): TypeMatchups => {
    return {
        atk: Array(18).fill(null),
        def: Array(18).fill(null),
        relativeOffense: Array(18).fill(null),
    }
}

export type Offenses = {
    pokemon: Pokemon;
    offense: number;
}[];
export interface TeamEvaluation {
    vulnerable: Record<Types, {
        offense: number;
        pokemon: Pokemon;
    }[]>;
    offenses: Record<Types, Offenses>;
}
export const getTeamEvaluation = (team: (Pokemon | null)[]): TeamEvaluation => {
    const typeVulnerabilities = team
        .map(pokemon => ({
            pokemon,
            defense: (pokemon?.typeMatchup ?? emptyMatchups()).def
        }))
        .reduce((totalVuln, cur) => {
            cur.defense.forEach((def, i) => {
                const type = POKEMON_TYPES[i]!;
                const existing = totalVuln[type] ?? [];
                const current = (cur?.pokemon && def < 1) ? [{
                    pokemon: cur.pokemon,
                    offense: cur.pokemon.typeMatchup.relativeOffense[i]!
                }] : [];
                totalVuln[type] = [...existing, ...current].sort((a, b) => a.offense - b.offense);
            });
            return totalVuln;
        }, <TeamEvaluation['vulnerable']>{});

    const typeOffenses = team
        .map(pokemon => ({
            pokemon,
            offense: (pokemon?.typeMatchup ?? emptyMatchups()).relativeOffense
        }))
        .reduce((totalOffenses, cur) => {
            cur.offense.forEach((offense, i) => {
                const existing = totalOffenses[i] ?? [];
                const current = (cur?.pokemon) ? [{
                    pokemon: cur.pokemon,
                    offense
                }] : [];
                totalOffenses[i] = [...existing, ...current];
            })
            return totalOffenses;
        }, <Offenses[]>[])
        .reduce((offenses, cur, i) => {
            const type = POKEMON_TYPES[i]!;
            offenses[type] = [...cur].sort((a, b) => b.offense - a.offense);
            return offenses;
        }, <Record<Types, Offenses>>{});

    return {
        vulnerable: typeVulnerabilities,
        offenses: typeOffenses,
    }
}

export interface TypeMatchups {
    atk: number[];
    def: number[];
    relativeOffense: number[];
}
export const getPokemonTypeMatchups = (types: Types[]): TypeMatchups => {
    const typeIndices = types
        .map(type => POKEMON_TYPES.findIndex(t => t === type));

    const atk = typeIndices
        .map(typeIdx => POKEMON_TYPE_ATK[typeIdx]!)
        .reduce((bestAtk, iAtk) => {
            return !bestAtk ? iAtk : bestAtk.map((a, i) => Math.max(a, iAtk[i]!));
        });

    const def = typeIndices
        .map(typeIdx => POKEMON_TYPE_DEF[typeIdx]!)
        .reduce((totalDef, iDef) => {
            return !totalDef ? iDef : totalDef.map((a, i) => a * iDef[i]!);
        });

    const relativeOffense = atk.map((iAtk, i) => {
        const iDef = def[i]!;
        return iAtk * iDef;
    });

    return {
        atk,
        def,
        relativeOffense
    };
};
