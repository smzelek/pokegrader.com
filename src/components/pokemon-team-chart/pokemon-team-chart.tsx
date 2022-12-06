import './pokemon-team-chart.scss';
import { Pokemon } from "src/api/pokeapi"
import { h, JSX } from 'preact';
import { useState } from "preact/hooks";
import { effectivenessRank, relativeStrengthRank, toShortTypes, vulnerabilityCountRank } from "src/utils";
import { emptyMatchups, Offenses, POKEMON_TYPES, TeamEvaluation, Types } from 'src/utils/pokegrader';
import Number from '../number/number';

const PokemonTeamChart = ({
    pokemonTeam,
    teamEvaluation,
}: {
    pokemonTeam: (Pokemon | null)[],
    teamEvaluation: TeamEvaluation;
}): JSX.Element => {
    const anyPokemon = pokemonTeam.some(p => !!p);

    return (
        <div className="pokemon-team-chart">
            <h2 className="bubble-font">type matchups</h2>
            <div className="team-card">
                <div className="type-row">
                    <div />
                    {POKEMON_TYPES.map(t =>
                        <div key={t} className={`cell type-block ${t}`}>
                            {toShortTypes(t)}
                        </div>
                    )}
                </div>
                <div className="rating-row">
                    <div className="header-cell">
                        offense
                    </div>
                    {Object.values(teamEvaluation.offenses).map((offenses, i) =>
                        <div key={i} className={`cell rating ${anyPokemon && relativeStrengthRank(offenses[0]?.offense)}`}>
                            {anyPokemon && <Number number={offenses[0]?.offense} />}
                        </div>
                    )}
                </div>
                <div className="rating-row">
                    <div className="header-cell">
                        safety
                    </div>
                    {Object.entries(teamEvaluation.offenses).map(([type, offenses]: [Types, Offenses], i) => {
                        const n = teamEvaluation.vulnerable[type].length;
                        const nthBestOffense = offenses[n]?.offense;
                        return (
                            <div key={i} className={`cell rating ${relativeStrengthRank(nthBestOffense)}`}>
                                <Number number={nthBestOffense} />
                            </div>
                        );
                    })}
                </div>
                <div className="rating-row">
                    <div className="header-cell vulnerable">
                        vulnerable
                    </div>
                    {Object.values(teamEvaluation.vulnerable).map((t, i) =>
                        <div key={i} className={`cell rating ${anyPokemon && vulnerabilityCountRank(t.length)}`}>
                            {anyPokemon && <Number number={t.length} />}
                        </div>
                    )}
                </div>
                {pokemonTeam.map((pokemon, i) => <PokemonRow key={pokemon?.id || i} pokemon={pokemon} />)}
            </div>
        </div>
    )
}

const PokemonRow = ({
    pokemon
}: {
    pokemon: Pokemon | null
}) => {
    const typeMatchup = pokemon?.typeMatchup ?? emptyMatchups();
    const hasMatchups = typeMatchup.atk.some(x => !!x)
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="pokemon-row">
            <div className={`header-cell ${hasMatchups && 'expandable'}`} onClick={() => {
                hasMatchups && setShowDetails(!showDetails);
            }}>
                <div className="sprite">
                    <img src={pokemon?.sprites.other["official-artwork"].front_default} alt={pokemon?.name} title={pokemon?.name} />
                    {hasMatchups && (<img className={`expand-caret ${showDetails && 'expanded'}`} src="/assets/icons/caret_down.svg" />)}
                </div>
            </div>
            {typeMatchup.relativeOffense.map((t, i) =>
                <div key={i} className={`cell rating ${relativeStrengthRank(t)}`}>
                    <Number number={t} />
                </div>
            )}
            {hasMatchups && showDetails && (
                <div className="details" onClick={() => {
                    setShowDetails(!showDetails);
                }}>
                    <div className="row">
                        <div className="header-cell">ATK</div>
                        {typeMatchup.atk.map((t, i) =>
                            <div key={i} className={`cell rating ${effectivenessRank(t)}`}>
                                <Number number={t} />
                            </div>
                        )}
                    </div>
                    <div className="row">
                        <div className="header-cell">DEF</div>
                        {typeMatchup.def.map((t, i) =>
                            <div key={i} className={`cell rating ${effectivenessRank(t)}`}>
                                <Number number={t} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PokemonTeamChart;