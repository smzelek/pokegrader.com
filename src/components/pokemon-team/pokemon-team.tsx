import './pokemon-team.scss'
import { h, JSX } from "preact";
import { Pokemon, SearchablePokemon } from "src/api/pokeapi";
import { toShortTypes } from "src/utils";
import Select from "../select/select";

export const PokemonTeam = ({
    pokemon,
    pokemonSelection,
    pokemonTeam,
    changePokemon,
}: {
    pokemon: SearchablePokemon[];
    pokemonSelection: (SearchablePokemon | null)[];
    changePokemon: (i: number, pokemon: (SearchablePokemon | null)) => void;
    pokemonTeam: (Pokemon | null)[];
}): JSX.Element => {
    console.log(pokemonSelection)
    return (
        <div className="pokemon-team">
            {/* TODO */}
            {/* <span>implement abilities/generation selector</span> */}
            <h2 className="bubble-font">choose your team</h2>
            <div className="pokemon-team-selection">
                {pokemonTeam.map((p, i) =>
                    <div key={p?.id || i} className="pokemon">
                        <Select
                            width='100%'
                            options={pokemon}
                            value={pokemonSelection[i]}
                            onChange={(pokemon) => {
                                changePokemon(i, pokemon!);
                            }}
                            render={(p) => p?.name}
                            mapToKey={(p) => p?.name}
                            mapToText={(p) => p?.name}
                        />
                        <div className="pokemon-info">
                            {p && (<img src={p.sprites.front_default} alt={p.name} title={p.name} />)}
                            <div className="types">
                                {p?.types.map(t =>
                                    <p key={t} className={`type-block ${t.type.name}`}>
                                        {toShortTypes(t.type.name)}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div >
        </div>
    );
};

export default PokemonTeam;