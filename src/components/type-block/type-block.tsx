import './type-block.scss'
import { h, JSX } from "preact";
import { toShortTypes, Types } from "src/utils"

const TypeBlock = ({
    type,
    short = true
}: {
    type: Types,
    short?: boolean
}): JSX.Element => {
    return <div className={`type-block ${type}`}>{short ? toShortTypes(type) : type}</div>;
};

export default TypeBlock;