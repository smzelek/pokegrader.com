import './number.scss';
import { h, JSX, Fragment } from "preact";
import { FractionParts, handleFraction } from "src/utils";

const Fraction = ({ numerator, denominator }: FractionParts) => {
    return (
        <span className="fraction">
            <sup>{numerator}</sup>/<sub>{denominator}</sub>
        </span>
    );
}

const Number = ({ number: _number }: { number: number | FractionParts | undefined }): JSX.Element => {
    const number = handleFraction(_number);

    if (number === undefined) {
        return <Fragment />
    }

    if (typeof number !== "number") {
        return <Fraction numerator={number.numerator} denominator={number.denominator} />
    }

    if (number === Infinity) {
        return <span style={{
            fontSize: '130%',
            lineHeight: '70%'
        }}>∞</span>;
    }

    return <Fragment>{number}</Fragment>;
};

export default Number;
