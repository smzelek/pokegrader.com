import './header.scss';
import { h } from 'preact';
import { currentUrl, TypedPokemon } from 'src/utils';

const Header = ({
    pokemonTeam
}: {
    pokemonTeam: (TypedPokemon | undefined)[]
}) => {
    const issuesUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSez_zBMwrucfsk7lSExnPWrAZgAEgFeDxlaF21DwmeAxOF0bQ/viewform';

    const makeIssuesUrl = (): string => {
        const issueParams = new URLSearchParams({
            usp: 'pp_url',
            'entry.179411854': currentUrl(pokemonTeam)
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
                        Feedback?
                        <p className="bubble-font">
                            Submit it!
                        </p>
                    </div>
                </a>
            </div>
        </header>
    );
};

export default Header;
