import './pokemon-team-chart.scss';
import { h, JSX } from 'preact';
import { useState } from "preact/hooks";
import { effectivenessRank, relativeStrengthRank, toShortTypes, vulnerabilityCountRank, Power, POKEMON_TYPES, TeamEvaluation, TypedPokemon, TypeMatchups, Types } from "src/utils";
import Number from '../number/number';
import { Bubble } from '../text/bubble';

const PokemonTeamChart = ({
    pokemonTeam,
    teamEvaluation,
}: {
    pokemonTeam: (TypedPokemon | undefined)[],
    teamEvaluation: TeamEvaluation;
}): JSX.Element => {
    const anyPokemon = pokemonTeam.some(p => !!p);

    return (
        <div id="pokemon-team-chart">
            <h2 className="bubble-font">see their matchups...</h2>
            <div className="team-card">
                <div className="team-chart">
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
                            power
                        </div>
                        {Object.values(teamEvaluation.powers).map((power, i) =>
                            <div key={i} className={`cell rating ${anyPokemon && relativeStrengthRank(power[0]?.power)}`}>
                                {anyPokemon && <Bubble><Number number={power[0]?.power} /></Bubble>}
                            </div>
                        )}
                    </div>
                    <div className="rating-row">
                        <div className="header-cell">
                            safety
                        </div>
                        {Object.entries(teamEvaluation.powers).map(([type, power]: [Types, Power], i) => {
                            const n = Math.max(teamEvaluation.weak[type].length - 1, 0);
                            const nthBestPower = power[n]?.power;
                            return (
                                <div key={i} className={`cell rating ${relativeStrengthRank(nthBestPower)}`}>
                                    <Bubble><Number number={nthBestPower} /></Bubble>
                                </div>
                            );
                        })}
                    </div>
                    <div className="rating-row">
                        <div className="header-cell weak">
                            weak
                        </div>
                        {Object.values(teamEvaluation.weak).map((t, i) =>
                            <div key={i} className={`cell rating ${anyPokemon && vulnerabilityCountRank(t.length)}`}>
                                {anyPokemon && <Bubble><Number number={t.length} /></Bubble>}
                            </div>
                        )}
                    </div>
                    {pokemonTeam.map((pokemon, i) => <PokemonRow key={i} pokemon={pokemon} />)}
                </div>
            </div>
        </div>
    )
}

const PokemonRow = ({
    pokemon
}: {
    pokemon: TypedPokemon | undefined
}) => {
    const typeMatchup = pokemon?.typeMatchup;

    const toTypeList = (s: keyof TypeMatchups) => POKEMON_TYPES.map(t => typeMatchup && typeMatchup[s][t]);
    const powers = toTypeList('power');
    const atk = toTypeList('atk');
    const defs = toTypeList('def');

    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="pokemon-row">
            <div className={`header-cell ${typeMatchup && 'expandable'}`} onClick={() => {
                typeMatchup && setShowDetails(!showDetails);
            }}>
                <div className="sprite">
                    <img src={pokemon?.sprites.other["official-artwork"].front_default} alt={pokemon?.name} title={pokemon?.name} />
                    {typeMatchup && (<img className={`expand-caret ${showDetails && 'expanded'}`} src="/assets/icons/caret_down.svg" />)}
                </div>
            </div>
            {powers.map((t, i) =>
                <div key={i} className={`cell rating ${relativeStrengthRank(t)}`}>
                    <Bubble><Number number={t} /></Bubble>
                </div>
            )}
            {typeMatchup && showDetails && (
                <div className="details" onClick={() => {
                    setShowDetails(!showDetails);
                }}>
                    <div className="row">
                        <div className="header-cell">ATK</div>
                        {atk.map((t, i) =>
                            <div key={i} className={`cell rating ${effectivenessRank(t)}`}>
                                <Bubble><Number number={t} /></Bubble>
                            </div>
                        )}
                    </div>
                    <div className="row">
                        <div className="header-cell">DEF</div>
                        {defs.map((t, i) =>
                            <div key={i} className={`cell rating ${effectivenessRank(t)}`}>
                                <Bubble><Number number={t} /></Bubble>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PokemonTeamChart;