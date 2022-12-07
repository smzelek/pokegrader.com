import 'preact/debug';
import './app.scss';
import { Fragment, h, JSX, render } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { PokemonTeam, PokemonReportCard, PokemonTeamChart, Header, Footer } from './components';
import { getTeamEvaluation, TypedPokemon } from './utils';
import { Params, readQueryParams } from './utils/query-params';

const App = (): JSX.Element => {
    const [pokemonTeam, setPokemonTeam] = useState<(TypedPokemon | undefined)[]>(Array(6).fill(undefined));
    const [initialParams, setInitialParams] = useState<Params>();

    useEffect(() => {
        setInitialParams(readQueryParams());
    }, []);

    const teamEvaluation = useMemo(() => {
        return getTeamEvaluation(pokemonTeam);
    }, [pokemonTeam]);

    return (
        <Fragment>
            <Header pokemonTeam={pokemonTeam} />
            <main>
                <PokemonTeam
                    initialParams={initialParams}
                    setPokemonTeam={setPokemonTeam}
                />
                <PokemonTeamChart
                    pokemonTeam={pokemonTeam}
                    teamEvaluation={teamEvaluation}
                />
                <PokemonReportCard
                    pokemonTeam={pokemonTeam}
                    teamEvaluation={teamEvaluation}
                />
            </main>
            <Footer />
        </Fragment>
    )
}

render(<App />, document.body);
