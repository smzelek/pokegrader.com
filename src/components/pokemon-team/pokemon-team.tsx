import './pokemon-team.scss'
import { h, JSX } from "preact";
import { getAllPokemon, getPokemon, Pokemon, PokemonSelection, SearchablePokemon } from "src/api/pokeapi";
import { useAsync, getPokemonTypeMatchups, TypedPokemon, Params } from "src/utils";
import Select from "../select/select";
import { useEffect, useMemo, useState } from 'preact/hooks';
import TypeBlock from '../type-block/type-block';

export const PokemonTeam = ({
    initialParams,
    setPokemonTeam,
}: {
    initialParams: Params | undefined,
    setPokemonTeam: (p: (TypedPokemon | undefined)[]) => void;
}): JSX.Element => {
    const [pokemonSelection, setPokemonSelection] = useState<PokemonSelection[]>(Array(6).fill({
        pokemon: undefined,
        ability: undefined,
    } as PokemonSelection));

    const changePokemon = (i: number, pokemon: SearchablePokemon | undefined) => {
        setPokemonSelection([
            ...pokemonSelection.slice(0, i),
            {
                pokemon,
                ability: undefined
            },
            ...pokemonSelection.slice(i + 1)
        ]);
    };

    const changeAbility = (i: number, ability: number | undefined) => {
        setPokemonSelection([
            ...pokemonSelection.slice(0, i),
            {
                pokemon: pokemonSelection[i]!.pokemon,
                ability
            },
            ...pokemonSelection.slice(i + 1)
        ])
    };

    const { value: allPokemon$ } = useAsync(getAllPokemon, [], { initialValue: [] });

    useEffect(() => {
        if (!initialParams) {
            return;
        }
        const initialSelection: PokemonSelection[] = initialParams.reduce((selection, param) => {
            const pokemon = allPokemon$[param.id - 1];
            selection[param.index] = {
                pokemon,
                ability: param.ability,
            };
            return selection;
        }, Array(6).fill({ pokemon: undefined, ability: undefined } as PokemonSelection));

        setPokemonSelection(initialSelection);
    }, [allPokemon$, initialParams])

    const { value: pokemon1 } = useAsync(() => getPokemon(pokemonSelection[0]), [pokemonSelection[0]?.pokemon?.nameId], { initialValue: undefined });
    const { value: pokemon2 } = useAsync(() => getPokemon(pokemonSelection[1]), [pokemonSelection[1]?.pokemon?.nameId], { initialValue: undefined });
    const { value: pokemon3 } = useAsync(() => getPokemon(pokemonSelection[2]), [pokemonSelection[2]?.pokemon?.nameId], { initialValue: undefined });
    const { value: pokemon4 } = useAsync(() => getPokemon(pokemonSelection[3]), [pokemonSelection[3]?.pokemon?.nameId], { initialValue: undefined });
    const { value: pokemon5 } = useAsync(() => getPokemon(pokemonSelection[4]), [pokemonSelection[4]?.pokemon?.nameId], { initialValue: undefined });
    const { value: pokemon6 } = useAsync(() => getPokemon(pokemonSelection[5]), [pokemonSelection[5]?.pokemon?.nameId], { initialValue: undefined });

    const toTyped = (p: Pokemon | undefined, ability: number | undefined) => {
        if (!p) {
            return undefined;
        }
        const types = p.types.map(t => t.type.name);
        console.log(p, types, ability)
        const typeMatchup = getPokemonTypeMatchups(types, ability !== undefined ? p.abilities[ability]?.nameId : undefined);
        return { ...p, typeMatchup }
    };

    const typedPokemon1 = useMemo(() => {
        return toTyped(pokemon1, pokemonSelection[0]?.ability)
    }, [pokemon1, pokemonSelection[0]?.ability]);
    const typedPokemon2 = useMemo(() => {
        return toTyped(pokemon2, pokemonSelection[1]?.ability)
    }, [pokemon2, pokemonSelection[1]?.ability]);
    const typedPokemon3 = useMemo(() => {
        return toTyped(pokemon3, pokemonSelection[2]?.ability)
    }, [pokemon3, pokemonSelection[2]?.ability]);
    const typedPokemon4 = useMemo(() => {
        return toTyped(pokemon4, pokemonSelection[3]?.ability)
    }, [pokemon4, pokemonSelection[3]?.ability]);
    const typedPokemon5 = useMemo(() => {
        return toTyped(pokemon5, pokemonSelection[4]?.ability)
    }, [pokemon5, pokemonSelection[4]?.ability]);
    const typedPokemon6 = useMemo(() => {
        return toTyped(pokemon6, pokemonSelection[5]?.ability)
    }, [pokemon6, pokemonSelection[5]?.ability]);

    const pokemonTeam = useMemo(() => {
        return [typedPokemon1, typedPokemon2, typedPokemon3, typedPokemon4, typedPokemon5, typedPokemon6].map((p, i) => {
            if (p === undefined) {
                return p;
            }
            const pokemonAbility = pokemonSelection[i]!.ability;
            return {
                ...p,
                chosenAbility: pokemonAbility !== undefined ? p.abilities[pokemonAbility] : undefined
            };
        })
    }, [typedPokemon1, typedPokemon2, typedPokemon3, typedPokemon4, typedPokemon5, typedPokemon6]);

    useEffect(() => {
        setPokemonTeam(pokemonTeam);
    }, [pokemonTeam]);

    return (
        <div className="pokemon-team">
            {/* TODO: implement generation selector */}
            <h2 className="bubble-font">choose your team</h2>
            <div className="pokemon-team-selection">
                {pokemonTeam.map((pokemon, i) => {
                    const pokemonAbility = pokemonSelection[i]!.ability;
                    const abilityValue = pokemonAbility !== undefined ? pokemon?.abilities[pokemonAbility] : undefined
                    return (<div key={i} className="pokemon">
                        <Select
                            width='100%'
                            options={allPokemon$}
                            value={pokemonSelection[i]!.pokemon}
                            onChange={(pokemon) => {
                                changePokemon(i, pokemon);
                            }}
                            render={(p) => p?.name}
                            mapToKey={(p, i) => p?.name || String(i)}
                            mapToText={(p) => p?.name || ''}
                            searchable={true}
                        />
                        <div className="pokemon-info">
                            {pokemon && (<img src={pokemon.sprites.front_default} alt={pokemon.name} title={pokemon.name} />)}
                            <div className="types">
                                {pokemon?.types.map((t, i) => <TypeBlock key={i} type={t.type.name} />)}
                            </div>
                        </div>
                        <div className="ability-selection">
                            {!!pokemon?.abilities.length && (
                                <Select
                                    width='100%'
                                    options={pokemon.abilities}
                                    value={abilityValue}
                                    onChange={(a) => {
                                        changeAbility(i, a?.index);
                                    }}
                                    render={(a) => a?.name}
                                    mapToKey={(a, i) => a?.nameId || String(i)}
                                    mapToText={(a) => a?.name || ''}
                                />
                            )}
                        </div>
                    </div>
                    )
                })}
            </div >
        </div>
    );
};

export default PokemonTeam;