import './pokemon-report-card.scss';
import { h, JSX } from 'preact';
import { JSXChildren, scaleDecimal, Power, POKEMON_TYPES, TeamEvaluation, Types, TypedPokemon } from 'src/utils';
import TypeBlock from '../type-block/type-block';
import Number from '../number/number';
import { Bubble } from '../text/bubble';
import ShareTray from '../share-tray/share-tray';

const PokemonReportCard = ({
    pokemonTeam,
    teamEvaluation,
}: {
    teamEvaluation: TeamEvaluation;
    pokemonTeam: (TypedPokemon | undefined)[];
}): JSX.Element => {
    const powerGrades = Object.values(teamEvaluation.powers).map((power) => {
        const bestPower = power[0]?.power || 0;
        if (bestPower > 2) {
            return 1;
        }
        if (bestPower === 2) {
            return 0.5;
        }
        return 0;
    });
    const powerGrade = powerGrades.reduce((a, b) => a + b, 0) / 18;

    const safetyGrades = Object.entries(teamEvaluation.powers).map(([type, power]: [Types, Power]) => {
        const n = Math.max(teamEvaluation.weak[type].length - 1, 0);
        const nthBestPower = power[n]?.power || 0;
        if (nthBestPower >= 2) {
            return 1;
        }
        if (nthBestPower === 1) {
            return 0.5;
        }
        return 0;
    });
    const safetyGrade = safetyGrades.reduce((a, b) => a + b, 0) / 18;

    const typeGrades = powerGrades
        .map((o, i) => ({ power: o, safety: safetyGrades[i]!, type: POKEMON_TYPES[i]! }))
        .reduce((acc, grade) => {
            acc[grade.type] = {
                power: grade.power,
                safety: grade.safety,
            };
            return acc;
        }, {} as Record<Types, { power: number, safety: number }>);

    const anyPokemon = pokemonTeam.some(p => !!p)

    return (
        <div id="pokemon-report-card">
            <div className="report-card-title">
                <h2 className="bubble-font">get your grade!</h2>
                <ShareTray pokemonTeam={pokemonTeam} />
            </div>
            <div className="report-card">
                <GradeCard
                    id="power-grade"
                    type='power'
                    grade={powerGrade}>
                    <p>
                        Your{' '}
                        <h4 className="bubble-font title">
                            power
                        </h4>
                        {' '}is your team's ability to overwhelm enemy Pokémon types.
                    </p>
                    <p>
                        <TypeBlock type='rock' short={false} />VS. <TypeBlock type='fire' short={false} /> (<Bubble>2X</Bubble> <Bold>ATK</Bold>) × (<Bubble>2X</Bubble> <Bold>DEF</Bold>) ＝ <Bubble>4X</Bubble> <Bold>Power</Bold>!
                    </p>
                    <p>
                        Score is based on your Best <Bold>Power</Bold> per type.
                    </p>
                    <p>
                        Full credit is given for <Bubble>4X</Bubble>+ <Bold>Power</Bold>, half credit for <Bubble>2X</Bubble> <Bold>Power</Bold>.
                    </p>
                </GradeCard>
                <GradeCard
                    id="safety-grade"
                    grade={safetyGrade}
                    type='safety'>
                    <p>
                        Your{' '}
                        <h4 className="bubble-font title">
                            safety
                        </h4>
                        {' '}is the stability of your <Bold>Power</Bold> against enemy types.
                    </p>
                    <p>
                        <Bold>3</Bold> weak Pokémon means you need <Bold>3</Bold> Pokémon with <Bubble>2X</Bubble>+ <Bold>Power</Bold>.
                    </p>
                    <p>
                        Score is based on Nth Best <Bold>Power</Bold> per type (N = weak Pokémon).
                    </p>
                    <p>
                        Full credit is given for <Bubble>2X</Bubble>+ <Bold>Power</Bold>, half credit for <Bubble>1X</Bubble> <Bold>Power</Bold>.
                    </p>
                </GradeCard>
                {anyPokemon && <div className="improvements">
                    {POKEMON_TYPES.map(t =>
                        <TypeGrade key={t} type={t} teamEvaluation={teamEvaluation} grades={typeGrades[t]} />
                    )}
                </div>}
            </div>
        </div >
    )
};

const GradeCard = ({
    id,
    grade,
    type,
    children
}: {
    id: string,
    grade: number,
    type: string,
    children: JSXChildren,
}) => {
    type Grade = 'best' | 'good' | 'decent' | 'okay' | 'poor';
    const gradeColorize = (grade: number): Grade => {
        if (grade >= 80) {
            return 'best';
        }
        if (grade >= 75) {
            return 'good'
        }
        if (grade >= 70) {
            return "decent"
        }
        if (grade >= 65) {
            return "okay"
        }
        return "poor"
    };
    const scaledGrade = scaleDecimal(grade, 100);

    return (
        <div id={id} className="grade-card">
            <div className={`grade bubble-font ${gradeColorize(scaledGrade)}`}>
                <h3 className="number">
                    {scaledGrade}%
                </h3>
                <p className="type">
                    {type}
                </p>
            </div>
            <div className="grade-rubric">
                {children}
            </div>
        </div>
    )
};


const TypeGrade = ({
    type,
    grades,
    teamEvaluation
}: {
    type: Types;
    grades: { power: number, safety: number };
    teamEvaluation: TeamEvaluation;
}) => {
    const benefactors = teamEvaluation.powers[type].filter((pokemon, i) => {
        const isVuln = teamEvaluation.weak[type].findIndex(v => v.pokemon.name === pokemon.pokemon.name) !== -1;
        const isWeak = pokemon.power < 1;
        const bestPower = teamEvaluation.powers[type][0]?.power;
        const isBestOrEqualTo = pokemon.power === bestPower;
        const isGreat = pokemon.power >= 4;
        const compareAgainstWeak = i <= teamEvaluation.weak[type].length - 1;
        return !isVuln && !isWeak && (isBestOrEqualTo || isGreat || compareAgainstWeak);
    });

    const effect: 'major' | 'minor' | '' = (() => {
        if (Object.values(grades).some(g => g === 0)) {
            return 'major'
        }
        if (Object.values(grades).some(g => g === 0.5)) {
            return 'minor'
        }
        return '';
    })();

    return <div className={`type-grade ${type}`}>
        <div className={`type-card ${effect}`}>
            <div className="type-header" >
                <TypeBlock type={type} short={false} />
            </div>
            <div className="actors">
                <div className="benefactors">
                    {benefactors.map((v, i) =>
                        <div key={i} className="pokemon">
                            <img src={v.pokemon.sprites.other['official-artwork'].front_default} alt={v.pokemon.name} title={v.pokemon.name} />
                            <Bubble><Number number={v.power} /></Bubble>
                        </div>
                    )}
                </div>
                <div className="detractors">
                    {teamEvaluation.weak[type].map((v, i) =>
                        <div key={i} className="pokemon">
                            <img src={v.pokemon.sprites.other['official-artwork'].front_default} alt={v.pokemon.name} title={v.pokemon.name} />
                            <Bubble><Number number={v.power} /></Bubble>
                        </div>
                    )}
                </div>
            </div>
        </div>
        <div className="effects">
            {grades.power < 1 && <Demerit grade={grades.power} kind='power' />}
            {grades.safety < 1 && <Demerit grade={grades.safety} kind='safety' />}
        </div>
    </div>
};

const Demerit = ({ grade, kind }: { grade: number, kind: string }) => {
    const size = grade === 0 ? 'major' : 'minor';
    return <span className={`bubble-font benefit ${size}`}>-{scaleDecimal((1 - grade) / 18, 100)}% {kind}</span>
};

const Bold = ({ children }: { children: JSXChildren }) => <span className="term">{children}</span>;

export default PokemonReportCard;
