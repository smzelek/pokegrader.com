import './share-tray.scss';
import { h } from 'preact';
import { currentUrl, TypedPokemon } from 'src/utils';

const ShareTray = ({
    pokemonTeam
}: {
    pokemonTeam: (TypedPokemon | undefined)[]
}) => {
    const TWITTER_URL = 'https://twitter.com/intent/tweet';
    const COPY = 'check out my pokemon teams score!'

    const makeTwitterUrl = (): string => {
        const issueParams = new URLSearchParams({
            text: `${COPY}!\n${currentUrl(pokemonTeam)}`
        }).toString();

        return `${TWITTER_URL}?${issueParams}`;
    };

    return (
        <div className="share-tray">
            <a id="twitter" className="icon twitter" href={TWITTER_URL} onClick={(event) => {
                event.preventDefault();
                window.open(makeTwitterUrl())
            }}>
                <img src='/assets/icons/twitter.svg' />
                <span>Tweet</span>
            </a>
        </div>
    )
}

export default ShareTray;
