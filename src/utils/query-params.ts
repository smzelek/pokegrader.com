import { TypedPokemon } from "./pokegrader";

export const currentUrl = (pokemonTeam: (TypedPokemon | undefined)[]) => `${window.location.href}?${toQueryParams(pokemonTeam)}`;

export type Params = ({
    index: number;
    id: number;
    ability: number | undefined;
})[];

const SEPARATOR = '.';

export const readQueryParams = (): Params => {
    const searchParams = new URLSearchParams(window.location.search);

    const pokemon: Params = searchParams
        .getAll('p')
        .reduce((o, p) => {
            const [idx, pokemonId, ability] = p.split(SEPARATOR);
            const index = Number(idx!);
            o[index] = {
                index,
                id: Number(pokemonId!),
                ability: ability !== undefined ? Number(ability) : undefined
            }
            return o;
        }, Array(6).fill(undefined) as Params)

    // TODO
    // delete the queryParams we just bootstrapped from
    // window.history.replaceState({ path: '/' }, '', '/');
    return pokemon.filter(p => !!p);
}

export const toQueryParams = (team: (TypedPokemon | undefined)[]): URLSearchParams => {
    const params: Params = team
        .map((p, i) => ({
            index: i,
            id: p?.id ? p.id : undefined,
            ability: p?.chosenAbility?.index
        }))
        .filter((p): p is NonNullable<Params[number]> => !!p.id);

    const pokemon = params
        .map((p) => {
            if (p.ability !== undefined) {
                return `${p.index}${SEPARATOR}${p.id}${SEPARATOR}${p.ability}`;
            }
            return `${p.index}${SEPARATOR}${p.id}`;
        })
        .map(p => ['p', p])


    return new URLSearchParams([...pokemon]);
}
