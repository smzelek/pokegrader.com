import { Ability, Pokemon } from "src/api/pokeapi";
import { product } from "./index";
import { POKEMON_TYPES, Types, TypeChart, POKEMON_TYPE_ATK, POKEMON_TYPE_DEF } from "./types";

export type TypedPokemon = Pokemon & {
    typeMatchup: TypeMatchups;
    chosenAbility: Ability | undefined;
}
export type Offenses = {
    pokemon: Pokemon;
    offense: number;
}[];

// TODO: rewrite as Transposition of TEAM[].typeMatchups{} to 
// then calculate vulnerabilities based on def < 1 as an addtl field "isVulnerable" 
// TYPES{}.pokemon ={name, offense, isVulnerable}[]
// TYPES{}.nthBest = ...Mathmax...n-1...

// Based strictly on a pokemon's defense, not effective offense ratio.
const getTeamVulnerabilities = (team: (TypedPokemon | undefined)[]): TeamEvaluation['vulnerable'] => {
    const defaultVuln: TeamEvaluation['vulnerable'] = POKEMON_TYPES.reduce((o, t) => {
        o[t] = [];
        return o;
    }, {} as TeamEvaluation['vulnerable']);

    const vulnChart = team.reduce((totalVuln, pokemon) => {
        const defChart = pokemon?.typeMatchup.def;
        if (!defChart) {
            return totalVuln;
        }
        Object.entries(defChart)
            .forEach(([type, def]: [Types, number]) => {
                const existing = totalVuln[type];
                const current = (def < 1) ? [{
                    pokemon,
                    offense: pokemon.typeMatchup.relativeOffense[type]!
                }] : [];
                totalVuln[type] = [...existing, ...current];
            });
        return totalVuln;
    }, defaultVuln);

    return Object.entries(vulnChart).reduce((o, [type, vuln]: [Types, Offenses]) => {
        o[type] = [...vuln].sort((a, b) => a.offense - b.offense);
        return o;
    }, {} as TeamEvaluation['vulnerable']);
}

// Team's effective offense ratios.
export const getTeamOffenses = (team: (TypedPokemon | undefined)[]): TeamEvaluation['offenses'] => {
    const defaultOffenses: TeamEvaluation['offenses'] = POKEMON_TYPES.reduce((o, t) => {
        o[t] = [];
        return o;
    }, {} as TeamEvaluation['offenses']);

    const offenseChart = team.reduce((totalOffenses, pokemon) => {
        const offenseChart = pokemon?.typeMatchup.relativeOffense;
        if (!offenseChart) {
            return totalOffenses;
        }
        Object.entries(offenseChart)
            .forEach(([type, offense]: [Types, number]) => {
                const existing = totalOffenses[type];
                totalOffenses[type] = [
                    ...existing,
                    {
                        pokemon,
                        offense
                    }
                ];
            })
        return totalOffenses;
    }, defaultOffenses);

    return Object.entries(offenseChart)
        .reduce((o, [type, offense]: [Types, TeamEvaluation['offenses'][Types]]) => {
            o[type] = [...offense].sort((a, b) => b.offense - a.offense);
            return o;
        }, {} as TeamEvaluation['offenses']);
}

export interface TeamEvaluation {
    vulnerable: Record<Types, Offenses>;
    offenses: Record<Types, Offenses>;

}
export const getTeamEvaluation = (team: (TypedPokemon | undefined)[]): TeamEvaluation => {
    return {
        vulnerable: getTeamVulnerabilities(team),
        offenses: getTeamOffenses(team),
    }
}

interface DefenseAbility {
    name: string;
    handle: (args: { attacker: Types, defPair: (number | undefined)[] }) => number | undefined;
}
const DEFENSE_ABILITIES: DefenseAbility[] = [
    {
        name: 'dry-skin',
        handle: (args) => {
            if (args.attacker === 'water') {
                return Infinity;
            }
            if (args.attacker === 'fire') {
                return product(args.defPair) * (1 / 1.25);
            }
            return undefined;
        }
    },
    {
        name: 'earth-eater',
        handle: (args) => {
            if (args.attacker === 'ground') {
                return Infinity;
            }
            return undefined;
        }
    },
    {
        name: 'filter',
        handle: (args) => {
            if (product(args.defPair) < 1) {
                return product(args.defPair) * (1 / 0.75);
            }
            return undefined;
        }
    },
    {
        name: 'flash-fire',
        handle: (args) => {
            if (args.attacker === 'fire') {
                return Infinity;
            }
            return undefined;
        }
    },
    {
        name: 'fluffy',
        handle: (args) => {
            if (args.attacker === 'fire') {
                return product(args.defPair) / 2;
            }
            return undefined;
        }
    },
    {
        name: 'heatproof',
        handle: (args) => {
            if (args.attacker === 'fire') {
                return product(args.defPair) * 2;
            }
            return undefined;
        }
    },
    {
        name: 'levitate',
        handle: (args) => {
            if (args.attacker === 'ground') {
                return Infinity;
            }
            return undefined;
        }
    },
    {
        name: 'lightning-rod',
        handle: (args) => {
            if (args.attacker === 'electric') {
                return Infinity;
            }
            return undefined;
        }
    },
    {
        name: 'motor-drive',
        handle: (args) => {
            if (args.attacker === 'electric') {
                return Infinity;
            }
            return undefined;
        }
    },
    {
        name: 'prism-armor',
        handle: (args) => {
            if (product(args.defPair) < 1) {
                return product(args.defPair) * (1 / 0.75);
            }
            return undefined;
        }
    },
    {
        name: 'purifying-salt',
        handle: (args) => {
            if (args.attacker === 'ghost') {
                return product(args.defPair) * 2;
            }
            return undefined;
        }
    },
    {
        name: 'sap-sipper',
        handle: (args) => {
            if (args.attacker === 'grass') {
                return Infinity;
            }
            return undefined;
        }
    },
    {
        name: 'solid-rock',
        handle: (args) => {
            if (product(args.defPair) < 1) {
                return product(args.defPair) * (1 / 0.75);
            }
            return undefined;
        }
    },
    {
        name: 'storm-drain',
        handle: (args) => {
            if (args.attacker === 'water') {
                return Infinity;
            }
            return undefined;
        }
    },
    {
        name: 'thick-fat',
        handle: (args) => {
            if (args.attacker === 'ice') {
                return product(args.defPair) * 2;
            }
            if (args.attacker === 'fire') {
                return product(args.defPair) * 2;
            }
            return undefined;
        }
    },
    {
        name: 'volt-absorb',
        handle: (args) => {
            if (args.attacker === 'electric') {
                return Infinity;
            }
            return undefined;
        }
    },
    {
        name: 'water-absorb',
        handle: (args) => {
            if (args.attacker === 'water') {
                return Infinity;
            }
            return undefined;
        }
    },
    {
        name: 'water-bubble',
        handle: (args) => {
            if (args.attacker === 'fire') {
                return product(args.defPair) * 2;
            }
            return undefined;
        }
    },
    {
        name: 'well-baked-body',
        handle: (args) => {
            if (args.attacker === 'fire') {
                return Infinity;
            }
            return undefined;
        }
    },
    {
        name: 'wonder-guard',
        handle: (args) => {
            if (args.defPair.every(d => d && d >= 1)) {
                return Infinity;
            }
            return undefined;
        }
    },
];

interface AttackAbilities {
    name: string;
    handle: (args: { attacker: Types, defender: Types, atk: number }) => number | undefined;
}
const ATTACK_ABILITIES: AttackAbilities[] = [
    {
        name: 'scrappy',
        handle: (args) => {
            if (args.attacker === 'normal' && args.defender === 'ghost') {
                return 1;
            }
            if (args.attacker === 'fighting' && args.defender === 'ghost') {
                return 1;
            }
            return undefined;
        }
    },
    {
        name: 'water-bubble',
        handle: (args) => {
            if (args.attacker === 'water') {
                return args.atk * 2;
            }
            return undefined;
        }
    },
    {
        name: 'tinted-lens',
        handle: (args) => {
            if (args.atk === 0.5) {
                return 1;
            }
            return undefined;
        }
    },
];

const defaultPairs = () => POKEMON_TYPES.reduce((o, t) => {
    o[t] = [undefined, undefined];
    return o;
}, {} as Record<Types, (number | undefined)[]>);

const getPokemonAttackValue = (atk: number, atkType: Types, defType: Types, ability: string | undefined): number => {
    const modifier = ATTACK_ABILITIES
        .find(a => a.name === ability)
        ?.handle({
            attacker: atkType,
            defender: defType,
            atk
        });

    if (modifier !== undefined) {
        return modifier;
    }

    return atk;
};

const getPokemonAttackChart = (atkTypes: Types[], ability: string | undefined): TypeChart => {
    const atkChartPairs: Record<Types, (number | undefined)[]> = atkTypes.reduce((atkChartPairs, atkType, pairNum) => {
        Object.entries(POKEMON_TYPE_ATK[atkType]).forEach(([defType, atk]: [Types, number]) => {
            atkChartPairs[defType]![pairNum] = getPokemonAttackValue(atk, atkType, defType, ability);
        });
        return atkChartPairs;
    }, defaultPairs());

    return Object.entries(atkChartPairs)
        .reduce((atkChart, [type, atkPair]: [Types, (number | undefined)[]]) => {
            atkChart[type] = atkPair.reduce((a, b) => Math.max(a || 0, b || 0), 0) as number;
            return atkChart;
        }, {} as TypeChart);
}

const getPokemonDefenseValue = (atkType: Types, defPair: (number | undefined)[], ability: string | undefined): number => {
    const modifier = DEFENSE_ABILITIES
        .find(a => a.name === ability)
        ?.handle({ attacker: atkType, defPair });

    if (modifier !== undefined) {
        return modifier;
    }

    return product(defPair);
}

const getPokemonDefenseChart = (defTypes: Types[], ability: string | undefined): TypeChart => {
    const defChartPairs: Record<Types, (number | undefined)[]> = defTypes
        .reduce((defChartPairs, defType, pairNum) => {
            const defenseChart = POKEMON_TYPE_DEF[defType];
            Object.entries(defenseChart).forEach(([type, def]: [Types, number]) => {
                defChartPairs[type]![pairNum] = def;
            });
            return defChartPairs;
        }, defaultPairs());

    return Object.entries(defChartPairs)
        .reduce((defChart, [type, defPair]: [Types, (number | undefined)[]]) => {
            defChart[type] = getPokemonDefenseValue(type, defPair, ability);
            return defChart;
        }, {} as TypeChart);
}

export interface TypeMatchups {
    atk: TypeChart;
    def: TypeChart;
    relativeOffense: TypeChart;
}
export const getPokemonTypeMatchups = (types: Types[], ability: string | undefined): TypeMatchups => {
    const atk = getPokemonAttackChart(types, ability);
    const def = getPokemonDefenseChart(types, ability);

    const relativeOffense = POKEMON_TYPES.reduce((offenseChart, type) => {
        offenseChart[type] = (() => {
            const iAtk = atk[type];
            const iVuln = def[type];
            if (iAtk === 0) { // 0 * Infinity = NaN
                return 0;
            }
            return iAtk * iVuln;
        })();
        return offenseChart;
    }, {} as TypeChart);

    return {
        atk,
        def,
        relativeOffense
    };
};

export const RELEVANT_ABILITIES = [...new Set([
    ...ATTACK_ABILITIES.map(a => a.name),
    ...DEFENSE_ABILITIES.map(a => a.name)
])]