import { Ability, Pokemon } from "src/api/pokeapi";
import { product } from "./index";
import { POKEMON_TYPES, Types, TypeChart, POKEMON_TYPE_ATK, POKEMON_TYPE_DEF } from "./types";

export type TypedPokemon = Pokemon & {
    typeMatchup: TypeMatchups;
    chosenAbility: Ability | undefined;
}
export type Power = {
    pokemon: Pokemon;
    power: number;
}[];

// Based strictly on a pokemon's defense, not effective power ratio.
const getTeamVulnerability = (team: (TypedPokemon | undefined)[]): TeamEvaluation['weak'] => {
    const defaultVuln: TeamEvaluation['weak'] = POKEMON_TYPES.reduce((o, t) => {
        o[t] = [];
        return o;
    }, {} as TeamEvaluation['weak']);

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
                    power: pokemon.typeMatchup.power[type]!
                }] : [];
                totalVuln[type] = [...existing, ...current];
            });
        return totalVuln;
    }, defaultVuln);

    return Object.entries(vulnChart).reduce((o, [type, vuln]: [Types, Power]) => {
        o[type] = [...vuln].sort((a, b) => a.power - b.power);
        return o;
    }, {} as TeamEvaluation['weak']);
}

// Team's effective power ratios.
export const getTeamPower = (team: (TypedPokemon | undefined)[]): TeamEvaluation['powers'] => {
    const defaultPower: TeamEvaluation['powers'] = POKEMON_TYPES.reduce((o, t) => {
        o[t] = [];
        return o;
    }, {} as TeamEvaluation['powers']);

    const powerChart = team.reduce((totalPower, pokemon) => {
        const _powerChart = pokemon?.typeMatchup.power;
        if (!_powerChart) {
            return totalPower;
        }
        Object.entries(_powerChart)
            .forEach(([type, power]: [Types, number]) => {
                const existing = totalPower[type];
                totalPower[type] = [
                    ...existing,
                    {
                        pokemon,
                        power: power
                    }
                ];
            })
        return totalPower;
    }, defaultPower);

    return Object.entries(powerChart)
        .reduce((o, [type, power]: [Types, TeamEvaluation['powers'][Types]]) => {
            o[type] = [...power].sort((a, b) => b.power - a.power);
            return o;
        }, {} as TeamEvaluation['powers']);
}

export interface TeamEvaluation {
    weak: Record<Types, Power>;
    powers: Record<Types, Power>;

}
export const getTeamEvaluation = (team: (TypedPokemon | undefined)[]): TeamEvaluation => {
    return {
        weak: getTeamVulnerability(team),
        powers: getTeamPower(team),
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
    power: TypeChart;
}
export const getPokemonTypeMatchups = (types: Types[], ability: string | undefined): TypeMatchups => {
    const atk = getPokemonAttackChart(types, ability);
    const def = getPokemonDefenseChart(types, ability);

    const power = POKEMON_TYPES.reduce((powerChart, type) => {
        powerChart[type] = (() => {
            const iAtk = atk[type];
            const iVuln = def[type];
            if (iAtk === 0) { // 0 * Infinity = NaN
                return 0;
            }
            return iAtk * iVuln;
        })();
        return powerChart;
    }, {} as TypeChart);

    return {
        atk,
        def,
        power
    };
};

export const RELEVANT_ABILITIES = [...new Set([
    ...ATTACK_ABILITIES.map(a => a.name),
    ...DEFENSE_ABILITIES.map(a => a.name)
])]