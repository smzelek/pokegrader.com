import { Fragment, h, JSX, render } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { getAllPokemon, getPokemon, rename, SearchablePokemon } from './api/pokeapi';
import './app.scss';
import { PokemonTeam, PokemonTeamInfo, PokemonTeamChart } from './components';
import { useAsync } from './utils';
import { getTeamEvaluation } from './utils/pokegrader';

const defaultPokemon = ['gastrodon', 'azumarill', 'houndoom', 'drakloak', 'magneton', 'carkol']
    .map(s => ({ nameId: s, name: rename(s) } as SearchablePokemon))

const App = (): JSX.Element => {
    const [pokemonSelection, setPokemonSelection] = useState<(SearchablePokemon | null)[]>(defaultPokemon); //todo
    const { value: allPokemon$ } = useAsync(getAllPokemon, [], { initialValue: [] });

    const { value: pokemon1 } = useAsync(() => getPokemon(pokemonSelection[0]?.nameId), [pokemonSelection[0]?.nameId], { initialValue: null });
    const { value: pokemon2 } = useAsync(() => getPokemon(pokemonSelection[1]?.nameId), [pokemonSelection[1]?.nameId], { initialValue: null });
    const { value: pokemon3 } = useAsync(() => getPokemon(pokemonSelection[2]?.nameId), [pokemonSelection[2]?.nameId], { initialValue: null });
    const { value: pokemon4 } = useAsync(() => getPokemon(pokemonSelection[3]?.nameId), [pokemonSelection[3]?.nameId], { initialValue: null });
    const { value: pokemon5 } = useAsync(() => getPokemon(pokemonSelection[4]?.nameId), [pokemonSelection[4]?.nameId], { initialValue: null });
    const { value: pokemon6 } = useAsync(() => getPokemon(pokemonSelection[5]?.nameId), [pokemonSelection[5]?.nameId], { initialValue: null });

    const pokemonTeam = useMemo(() => [pokemon1, pokemon2, pokemon3, pokemon4, pokemon5, pokemon6],
        [pokemon1, pokemon2, pokemon3, pokemon4, pokemon5, pokemon6]);

    const teamEvaluation = useMemo(() => {
        return getTeamEvaluation(pokemonTeam);
    }, [pokemonTeam]);

    return (
        <Fragment>
            <header>
                <h1 className="bubble-font title">
                    <div className="logo">
                        <div className="wrapper"><div className="bottom" /></div>
                        <div className="wrapper"><div className="line" /></div>
                        <div className="wrapper"><div className="circle" /></div>
                    </div>
                    PokéGrader
                </h1>
            </header>
            <main>
                <PokemonTeam
                    pokemonTeam={pokemonTeam}
                    pokemonSelection={pokemonSelection}
                    pokemon={allPokemon$}
                    changePokemon={(i, pokemon) => {
                        setPokemonSelection([...pokemonSelection.slice(0, i), pokemon, ...pokemonSelection.slice(i + 1)])
                        console.log(pokemonSelection)
                    }}
                />
                <PokemonTeamChart
                    pokemonTeam={pokemonTeam}
                    teamEvaluation={teamEvaluation}
                />
                {pokemonTeam.every(p => !!p) && (
                    <PokemonTeamInfo
                        teamEvaluation={teamEvaluation}
                    />
                )}
            </main>
            <footer>
                <div className="banner">
                    <a href="https://github.com/smzelek/pokegrader.js" className="github-link">
                        <svg fill="white" aria-hidden="true" viewBox="0 0 16 16" version="1.1" data-view-component="true" className="github-logo">
                            <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                        </svg>
                        coded by Steve Zelek using Preact
                    </a>
                </div>
            </footer>
        </Fragment>
    )
}

render(<App />, document.body);
