import { h, JSX, Fragment } from "preact";

const Number = ({ number }: { number: number | undefined }): JSX.Element => {
    if (number === undefined) {
        return <Fragment />
    }
    if (number === Infinity) {
        return <span style={{
            fontSize: '130%',
            lineHeight: '70%'
        }}>∞</span>;
    }
    if (!String(number).includes('.')) {
        return <Fragment>{number}</Fragment>;
    }
    const commonDivisor = (a: number, b: number): number => {
        if (b < 0.0000001) return a;
        return commonDivisor(b, Math.floor(a % b));
    };

    const len = number.toString().length - 2;

    const denominator = Math.pow(10, len);
    const numerator = number * denominator;

    const divisor = commonDivisor(numerator, denominator);

    return (
        <span className="fraction">
            <sup>{numerator / divisor}</sup>/<sub>{denominator / divisor}</sub>
        </span>
    );
};

export default Number;
