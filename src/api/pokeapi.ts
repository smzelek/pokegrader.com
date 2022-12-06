import { toSearchable, toTitleCase } from "src/utils";
import { getPokemonTypeMatchups, TypeMatchups, Types } from "src/utils/pokegrader";

export interface Resource {
    name: string;
    url: string;
}

export interface SearchablePokemon {
    nameId: string;
    name: string;
    searchable: string;
}

export const rename = (n: string): string => {
    if (n === 'mr-mime') {
        return 'Mr. Mime'
    }
    if (n === 'mr-mime-galar') {
        return 'Mr. Mime (Galar)'
    }
    if (n === 'ho-oh') {
        return 'Ho-Oh'
    }
    if (n === 'mime-jr') {
        return 'Mime Jr.'
    }
    if (n === 'porygon-z') {
        return 'Porygon-Z'
    }
    if (n === 'mr-rime') {
        return 'Mr. Rime'
    }
    if (n === 'jangmo-o') {
        return 'Jangmo-o'
    }
    if (n === 'hakamo-o') {
        return 'Hakamo-o'
    }
    if (n === 'kommo-o') {
        return 'Kommo-o'
    }
    if (n === 'type-null') {
        return 'Type: Null'
    }
    const [name, ...info] = n.split('-').map((s: string) => {
        if (s === 'male') {
            return 'm';
        }
        if (s === 'female') {
            return 'f'
        }
        return s;
    }).map(toTitleCase);
    return info.length ? `${name} (${info.join(' ')})` : name!;
};

interface GetAllPokemon {
    count: number;
    next: string;
    previous: string;
    results: Resource[]
}
export const getAllPokemon = async (): Promise<SearchablePokemon[]> => {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1154');
    const data: GetAllPokemon = await res.json();
    return data.results.map(d => {
        const name = rename(d.name)
        return {
            nameId: d.name,
            name,
            searchable: toSearchable(name)
        }
    });
}

export interface Pokemon {
    abilities: {
        ability: Resource;
        is_hidden: boolean;
        slot: number;
    }[];
    base_experience: number;
    forms: Resource[];
    game_indices: {
        game_index: number;
        version: Resource;
    }[];
    height: number;
    id: number;
    moves: {
        move: Resource;
        version_group_details: {
            level_learned_at: number;
            move_learn_method: Resource;
            version_group: Resource;
        }[]
    }[];
    name: string;
    order: number;
    past_types: {
        generation: Resource;
        types: {
            slot: number;
            type: Resource;
        }[]
    }[]
    species: Resource;
    sprites: {
        front_default: string;
        other: {
            dream_world: {
                front_default: string;
            };
            home: {
                front_default: string;
            };
            'official-artwork': {
                front_default: string;
            }
        }
    };
    stats: {
        base_stat: number;
        effort: number;
        stat: Resource;
    }[]
    types: {
        slot: number;
        type: {
            name: Types;
            url: string;
        };
    }[];
    typeMatchup: TypeMatchups;
    weight: number;
}
export const getPokemon = async (id: string | undefined): Promise<Pokemon | null> => {
    if (!id) {
        return null;
    }
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json() as Pokemon;
    const typeMatchup = (() => {
        const types = data.types.map(t => t.type.name);
        return getPokemonTypeMatchups(types);
    })();
    return { ...data, name: rename(data.name), typeMatchup };
}