import './header.scss';
import { h } from 'preact';
import { currentUrl, TypedPokemon } from 'src/utils';

const Header = ({
    pokemonTeam
}: {
    pokemonTeam: (TypedPokemon | undefined)[]
}) => {
    const issuesUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScrbjDLotIHBnqD06RYZfdpLA7U_d1H4TJ0g4L5qro8g8GaEw/viewform';

    const makeIssuesUrl = (): string => {
        const issueParams = new URLSearchParams({
            usp: 'pp_url',
            'entry.368646608': currentUrl(pokemonTeam)
        }).toString();

        return `${issuesUrl}?${issueParams}`;
    };

    return (
        <header>
            <h1 className="bubble-font title">
                <div className="logo">
                    <div className="wrapper"><div className="bottom" /></div>
                    <div className="wrapper"><div className="line" /></div>
                    <div className="wrapper"><div className="circle" /></div>
                </div>
                pokégrader
            </h1>
            <div className="bug-report">
                <a id="report" className="link" href={issuesUrl} onClick={(event) => {
                    event.preventDefault();
                    window.open(makeIssuesUrl())
                }}>
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10.png" />
                    <div className="report-text">
                        Found a bug?
                        <p className="bubble-font">
                            Report it!
                        </p>
                    </div>
                </a>
            </div>
        </header>
    );
};

export default Header;
