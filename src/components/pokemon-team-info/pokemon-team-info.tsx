import { h, JSX } from 'preact';
import { JSXChildren, scaleDecimal } from 'src/utils';
import { Offenses, POKEMON_TYPES, TeamEvaluation, Types } from 'src/utils/pokegrader';
import TypeBlock from '../type-block/type-block';
import Number from '../number/number';
import './pokemon-team-info.scss';

const PokemonTeamInfo = ({
    teamEvaluation,
}: {
    teamEvaluation: TeamEvaluation;
}): JSX.Element => {
    const offenseGrades = Object.values(teamEvaluation.offenses).map((offenses) => {
        const bestOffense = offenses[0]?.offense || 0;
        if (bestOffense > 2) {
            return 1;
        }
        if (bestOffense === 2) {
            return 0.5;
        }
        return 0;
    });
    const offenseGrade = offenseGrades.reduce((a, b) => a + b, 0) / 18;

    const safetyGrades = Object.entries(teamEvaluation.offenses).map(([type, offenses]: [Types, Offenses]) => {
        const n = Math.max(teamEvaluation.vulnerable[type].length - 1, 0);
        const nthBestOffense = offenses[n]?.offense || 0;
        if (nthBestOffense >= 2) {
            return 1;
        }
        if (nthBestOffense === 1) {
            return 0.5;
        }
        return 0;
    });
    const safetyGrade = safetyGrades.reduce((a, b) => a + b, 0) / 18;

    const typeGrades = offenseGrades
        .map((o, i) => ({ offense: o, safety: safetyGrades[i]!, type: POKEMON_TYPES[i]! }))
        .reduce((acc, grade) => {
            acc[grade.type] = {
                offense: grade.offense,
                safety: grade.safety,
            };
            return acc;
        }, {} as Record<Types, { offense: number, safety: number }>);

    return (
        <div className="pokemon-team-info">
            <h2 className="bubble-font">report card</h2>
            <div className="report-card">
                <div className="improvements">
                    {POKEMON_TYPES.map(t =>
                        <TypeGrade key={t} type={t} teamEvaluation={teamEvaluation} grades={typeGrades[t]} />
                    )}
                </div>
                <GradeCard
                    type='offense'
                    grade={offenseGrade}>
                    <p>
                        Your{' '}
                        <h3 className="bubble-font title">
                            offense
                        </h3>
                        {' '}is your team's ability to overwhelm enemy Pokémon types.
                    </p>
                    <p>
                        <TypeBlock type='rock' short={false} />VS. <TypeBlock type='fire' short={false} /> (<Bubble>2X</Bubble> <Bold>ATK</Bold>) × (<Bubble>2X</Bubble> <Bold>DEF</Bold>) ＝ <Bubble>4X</Bubble> <Bold>Offense</Bold>!
                    </p>
                    <p>
                        Score is based on your Best <Bold>Offense</Bold> per type.
                    </p>
                    <p>
                        Full credit is given for <Bubble>4X</Bubble>+ <Bold>Offense</Bold>, half credit for <Bubble>2X</Bubble> <Bold>Offense</Bold>.
                    </p>
                </GradeCard>
                <GradeCard
                    grade={safetyGrade}
                    type='safety'>
                    <p>
                        Your{' '}
                        <h3 className="bubble-font title">
                            safety
                        </h3>
                        {' '}is the stability of your team's <Bold>Offense</Bold> against enemy Pokémon types.
                    </p>
                    <p>
                        <Bold>3</Bold> vulnerable Pokémon means you need <Bold>3</Bold> Pokémon with <Bubble>2X</Bubble>+ <Bold>Offense</Bold>.
                    </p>
                    <p>
                        Score is based on Nth Best <Bold>Offense</Bold> per type (N = number of vulnerable Pokémon).
                    </p>
                    <p>
                        Full credit is given for <Bubble>2X</Bubble>+ <Bold>Offense</Bold>, half credit for <Bubble>1X</Bubble> <Bold>Offense</Bold>.
                    </p>
                </GradeCard>
                {/* TODO */}
                {/* <div>
                    share on social media buttons
                </div> */}
            </div>
        </div >
    )
};

const GradeCard = ({
    grade,
    type,
    children
}: {
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
        <div className="grade-card">
            <div className={`grade bubble-font ${gradeColorize(scaledGrade)}`}>
                <p className="number">
                    {scaledGrade}%
                </p>
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
    grades: { offense: number, safety: number };
    teamEvaluation: TeamEvaluation;
}) => {
    const benefactors = teamEvaluation.offenses[type].filter((pokemon, i) => {
        const isVuln = teamEvaluation.vulnerable[type].findIndex(v => v.pokemon.name === pokemon.pokemon.name) !== -1;
        const bestOffense = teamEvaluation.offenses[type][0]?.offense;
        const isBestOrEqualTo = pokemon.offense === bestOffense;
        const isGreat = pokemon.offense >= 4;
        const compareAgainstVulnerable = i <= teamEvaluation.vulnerable[type].length - 1;
        return !isVuln && (isBestOrEqualTo && isGreat) || compareAgainstVulnerable;
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

    return <div className="type-grade">
        <div className={`type-card ${effect}`}>
            <div className="type-header" >
                <TypeBlock type={type} short={false} />
            </div>
            <div className="actors">
                <div className="benefactors">
                    {benefactors.map(v =>
                        <div key={v.pokemon.id} className="pokemon">
                            <img src={v.pokemon.sprites.other['official-artwork'].front_default} alt={v.pokemon.name} title={v.pokemon.name} />
                            <Bubble><Number number={v.offense} /></Bubble>
                        </div>
                    )}
                </div>
                <div className="detractors">
                    {teamEvaluation.vulnerable[type].map(v =>
                        <div key={v.pokemon.id} className="pokemon">
                            <img src={v.pokemon.sprites.other['official-artwork'].front_default} alt={v.pokemon.name} title={v.pokemon.name} />
                            <Bubble><Number number={v.offense} /></Bubble>
                        </div>
                    )}
                </div>
            </div>
        </div>
        <div className="effects">
            {grades.offense < 1 && <Demerit grade={grades.offense} kind='offense' />}
            {grades.safety < 1 && <Demerit grade={grades.safety} kind='safety' />}
        </div>
    </div>
};

const Demerit = ({ grade, kind }: { grade: number, kind: string }) => {
    const size = grade === 0 ? 'major' : 'minor';
    return <span className={`bubble-font benefit ${size}`}>-{scaleDecimal((1 - grade) / 18, 100)}% {kind}</span>
};

const Bold = ({ children }: { children: JSXChildren }) => <span className="term">{children}</span>;
const Bubble = ({ children }: { children: JSXChildren }) => <span className="bubble-font">{children}</span>;

export default PokemonTeamInfo;
